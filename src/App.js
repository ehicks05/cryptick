import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useLocalStorage } from "react-use";
import useInterval from "@use-it/interval";
import { getProducts, get24HourStats } from "./api";
import {
  SOCKET_STATUSES,
  WS_URL,
  DEFAULT_SELECTED_PRODUCTS,
} from "./constants";
import {
  getPrettyPrice,
  buildSubscribeMessage,
  flashPriceColorChange,
} from "./utils";
import { Settings, ProductSection, Header, Footer } from "./components";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    const set = async () => setProducts(await getProducts());
    set();
  }, []);

  const [selectedProducts, setSelectedProducts] = useLocalStorage(
    "selectedProducts",
    DEFAULT_SELECTED_PRODUCTS
  );

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendJsonMessage(buildSubscribeMessage("subscribe", selectedProducts));
    },
    onMessage: (event) => handleMessage(JSON.parse(event.data)),
    onError: (event) => console.log(event),
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useInterval(() => {
    const set = async () => {
      const newStats = await get24HourStats(selectedProducts);
      setStats(newStats);
    };
    set();
  }, 60000);

  useEffect(() => {
    const set = async () => {
      const newStats = await get24HourStats(selectedProducts);
      setStats(newStats);
    };
    set();
  }, [selectedProducts]);

  useEffect(() => {
    document.getElementById("favicon").href =
      SOCKET_STATUSES[readyState].favicon;
  }, [readyState]);

  const handleMessage = ({ type, product_id: productId, price: rawPrice }) => {
    if (type === "ticker") {
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { prevPrice: 0 } });

      const price = getPrettyPrice(Number.parseFloat(rawPrice));

      const priceEl = document.getElementById(`${productId}Price`);
      if (priceEl)
        flashPriceColorChange(price, prices[productId]?.prevPrice, priceEl);

      const newPrices = {
        ...prices,
        [productId]: { prevPrice: price, price },
      };
      setPrices(newPrices);

      if (productId === "BTC-USD") document.title = price + " BTC-USD";
    }
  };

  const toggleProduct = useCallback(
    (productId) => {
      const showProduct = !selectedProducts.includes(productId);

      sendJsonMessage(
        buildSubscribeMessage(showProduct ? "subscribe" : "unsubscribe", [
          productId,
        ])
      );

      const stable = selectedProducts.filter((p) => p !== productId);
      const newProducts = [...stable, ...(showProduct ? [productId] : [])];

      setSelectedProducts(newProducts);
    },
    [sendJsonMessage, selectedProducts, setSelectedProducts]
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
        selectedProducts={selectedProducts}
        toggleProduct={toggleProduct}
      />
      <div className="flex flex-wrap p-4">
        {selectedProducts.map((selectedProduct) => {
          return (
            <ProductSection
              key={selectedProduct}
              productId={selectedProduct}
              productPrice={prices[selectedProduct]}
              productStats={stats[selectedProduct]}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
}

export default App;
