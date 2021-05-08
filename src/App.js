import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useLocalStorage } from "react-use";
import useInterval from "@use-it/interval";
import { getCurrencies, getProducts, get24HourStats, getCandles } from "./api";
import {
  SOCKET_STATUSES,
  WS_URL,
  DEFAULT_SELECTED_PRODUCT_IDS,
} from "./constants";
import {
  getPrettyPrice,
  buildSubscribeMessage,
  flashPriceColorChange,
} from "./utils";
import { Settings, Products, Header, Footer } from "./components";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [currencies, setCurrencies] = useState({});
  const [products, setProducts] = useState({});
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});
  const [candles, setCandles] = useState({});

  useEffect(() => {
    const set = async () => {
      setProducts(await getProducts());
      setCurrencies(await getCurrencies());
      setStats(await get24HourStats());
      setCandles(await getCandles(selectedProductIds));
    };
    set();
  }, []);

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

  const handleMessage = ({ type, product_id: productId, price: rawPrice }) => {
    if (type === "ticker") {
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { price: 0 } });

      const price = getPrettyPrice(
        Number.parseFloat(rawPrice),
        products[productId].minimumFractionDigits
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

  return (
    <>
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
            currencies={currencies}
            products={products}
            selectedProducts={selectedProductIds}
            toggleProduct={toggleProduct}
          />
          <Products
            currencies={currencies}
            products={products}
            stats={stats}
            candles={candles}
            selectedProductIds={selectedProductIds}
            setSelectedProductIds={setSelectedProductIds}
            prices={prices}
          />
        </>
      )}
      <Footer />
    </>
  );
}

export default App;
