import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useLocalStorage } from "react-use";
import useInterval from "@use-it/interval";
import { getCurrencies, getProducts, get24HourStats } from "./api";
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
import { Settings, ProductSection, Header, Footer } from "./components";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [currencies, setCurrencies] = useState({});
  const [products, setProducts] = useState({});
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    const set = async () => {
      setProducts(await getProducts());
      setCurrencies(await getCurrencies());
      setStats(await get24HourStats());
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
  });

  useInterval(() => {
    const set = async () => {
      setStats(await get24HourStats());
    };
    set();
  }, 60000);

  const handleMessage = ({ type, product_id: productId, price: rawPrice }) => {
    if (type === "ticker") {
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { price: 0 } });

      const price = getPrettyPrice(
        Number.parseFloat(rawPrice),
        products[productId].quote_increment.length - 2
      );

      const priceEl = document.getElementById(`${productId}Price`);
      if (priceEl)
        flashPriceColorChange(price, prices[productId]?.price, priceEl);

      setPrices({
        ...prices,
        [productId]: { price },
      });

      if (productId === "BTC-USD") document.title = price + " BTC-USD";
    }
  };

  const toggleProduct = useCallback(
    (productId) => {
      const showProduct = !selectedProductIds.includes(productId);

      sendJsonMessage(
        buildSubscribeMessage(showProduct ? "subscribe" : "unsubscribe", [
          productId,
        ])
      );

      const stable = selectedProductIds.filter((p) => p !== productId);
      const newProducts = [...stable, ...(showProduct ? [productId] : [])];

      setSelectedProductIds(newProducts);
    },
    [sendJsonMessage, selectedProductIds, setSelectedProductIds]
  );

  return (
    <>
      <Header
        title={SOCKET_STATUSES[readyState].name}
        titleClass={SOCKET_STATUSES[readyState].class}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      <Settings
        showSettings={showSettings}
        products={products}
        selectedProducts={selectedProductIds}
        toggleProduct={toggleProduct}
      />
      <div className="max-w-screen-lg mx-auto flex flex-wrap justify-center p-4">
        {!!Object.keys(currencies).length &&
          !!Object.keys(products).length &&
          !!Object.keys(stats).length &&
          selectedProductIds.map((selectedProductId) => {
            return (
              <ProductSection
                key={selectedProductId}
                product={products[selectedProductId]}
                productPrice={prices[selectedProductId]}
                productStats={stats[selectedProductId]}
                currency={currencies[products[selectedProductId].base_currency]}
              />
            );
          })}
      </div>
      <Footer />
    </>
  );
}

export default App;
