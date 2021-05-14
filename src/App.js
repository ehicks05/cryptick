import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import useWebSocket from "react-use-websocket";
import { useLocalStorage, useThrottle } from "react-use";
import useInterval from "@use-it/interval";
import Loader from "react-loader-spinner";

import { getCurrencies, getProducts, get24HourStats, getCandles } from "./api";
import {
  SOCKET_STATUSES,
  WS_URL,
  DEFAULT_SELECTED_PRODUCT_IDS,
} from "./constants";
import {
  formatPrice,
  formatTime,
  buildSubscribeMessage,
  flashPriceColorChange,
} from "./utils";
import {
  Settings,
  Products,
  ProductDetail,
  Header,
  Footer,
} from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isReorderEnabled, setIsReorderEnabled] = useState(false);
  const [currencies, setCurrencies] = useState({});
  const [products, setProducts] = useState({});
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});
  const [candles, setCandles] = useState({});
  const [messages, setMessages] = useState({});

  const throttledMessages = useThrottle(messages, 250);
  const throttledPrices = useThrottle(prices, 250);

  useEffect(() => {
    const set = async () => {
      setProducts(await getProducts());
      setCurrencies(await getCurrencies());
      setStats(await get24HourStats());
      setCandles(await getCandles(selectedProductIds));
    };
    set();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedProductIds, setSelectedProductIds] = useLocalStorage(
    "selectedProductIds",
    DEFAULT_SELECTED_PRODUCT_IDS
  );

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendJsonMessage(buildSubscribeMessage("subscribe", selectedProductIds));
    },
    onMessage: (event) => handleMessage(JSON.parse(event.data)),
    onError: (event) => console.log(event),
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
    reconnectAttempts: 50,
    reconnectInterval: 2000,
  });

  useInterval(() => {
    const set = async () => {
      setStats(await get24HourStats());
      setCandles(await getCandles(selectedProductIds));
    };
    set();
  }, 60000);

  const handleMessage = (message) => {
    const { type, product_id: productId, price: rawPrice } = message;
    if (type === "ticker") {
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { price: 0 } });

      const price = formatPrice(
        rawPrice,
        products[productId].minimumQuoteDigits
      );

      const priceEl = document.getElementById(`${productId}Price`);
      if (priceEl)
        flashPriceColorChange(price, prices[productId]?.price, priceEl);

      setPrices({
        ...prices,
        [productId]: { price },
      });

      if (productId === selectedProductIds[0])
        document.title = `${price} ${
          products[selectedProductIds[0]].display_name
        }`;

      setMessages((messages) => {
        const { sequence, time, side, last_size } = message;
        const newMessage = {
          sequence,
          time: formatTime(new Date(time)),
          side,
          price,
          last_size: formatPrice(
            last_size,
            products[productId].minimumBaseDigits
          ),
        };

        return {
          ...messages,
          [productId]: _.take(
            [newMessage, ...(messages[productId] || [])],
            100
          ),
        };
      });
    }
  };

  const toggleProduct = useCallback(
    async (productId) => {
      const showProduct = !selectedProductIds.includes(productId);

      sendJsonMessage(
        buildSubscribeMessage(showProduct ? "subscribe" : "unsubscribe", [
          productId,
        ])
      );

      const stable = selectedProductIds.filter((p) => p !== productId);
      const newProducts = [...stable, ...(showProduct ? [productId] : [])];

      setSelectedProductIds(newProducts);

      if (showProduct) {
        const newCandles = await getCandles([productId]);
        setCandles((candles) => ({ ...candles, ...newCandles }));
      }
    },
    [sendJsonMessage, selectedProductIds, setSelectedProductIds]
  );

  const isLoaded =
    !!Object.keys(currencies).length &&
    !!Object.keys(products).length &&
    !!Object.keys(stats).length;

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader type="Rings" color="#00BFFF" height={256} width={256} />
      </div>
    );

  return (
    <Router>
      <div className="flex flex-col">
        <Header
          title={SOCKET_STATUSES[readyState].name}
          titleClass={SOCKET_STATUSES[readyState].class}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
        {isLoaded && (
          <>
            <Settings
              showSettings={showSettings}
              isReorderEnabled={isReorderEnabled}
              setIsReorderEnabled={setIsReorderEnabled}
              currencies={currencies}
              products={products}
              selectedProducts={selectedProductIds}
              toggleProduct={toggleProduct}
            />
            <Switch>
              <Route path="/:productId">
                <ProductDetail
                  currencies={currencies}
                  products={products}
                  stats={stats}
                  candles={candles}
                  prices={throttledPrices}
                  throttledMessages={throttledMessages}
                />
              </Route>
              <Route path="/">
                <Products
                  currencies={currencies}
                  products={products}
                  stats={stats}
                  candles={candles}
                  prices={throttledPrices}
                  isReorderEnabled={isReorderEnabled}
                  selectedProductIds={selectedProductIds}
                  setSelectedProductIds={setSelectedProductIds}
                />
              </Route>
            </Switch>
          </>
        )}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
