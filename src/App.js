import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import useInterval from "@use-it/interval";
import { getProducts, get24HourStats } from "./api";
import { SOCKET_STATUSES, WS_URL } from "./constants";
import {
  getPrettyPrice,
  buildSubscribeMessage,
  flashPriceColorChange,
} from "./utils";
import { Settings, ProductSection, Header, Footer } from "./components";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    const set = async () => setProducts(await getProducts());
    set();
  }, []);

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      sendJsonMessage(buildSubscribeMessage("subscribe", selectedProducts));
    },
    onMessage: (event) => handleMessage(JSON.parse(event.data)),
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useEffect(() => {
    if (!localStorage.getItem("products")) {
      localStorage.setItem(
        "products",
        JSON.stringify({ "BTC-USD": "BTC-USD" })
      );
    }
    const selectedProductIds = Object.keys(
      JSON.parse(localStorage.getItem("products"))
    );
    setSelectedProducts(selectedProductIds);
    sendJsonMessage(buildSubscribeMessage("subscribe", selectedProductIds));

    const set = async () => {
      const newStats = await get24HourStats(selectedProductIds);
      setStats(newStats);
    };
    set();
  }, []);

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

  const handleMessage = (message) => {
    if (message.type === "ticker") {
      const productId = message.product_id;
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { lastPrice: 0 } });

      const price = Number.parseFloat(message.price);
      const prettyPrice = getPrettyPrice(price);

      const priceEl = document.getElementById(`${productId}Price`);
      if (priceEl)
        flashPriceColorChange(price, prices[productId]?.lastPrice, priceEl);

      const newPrices = {
        ...prices,
        [productId]: { lastPrice: price, prettyPrice },
      };
      setPrices(newPrices);

      if (productId === "BTC-USD") document.title = prettyPrice + " BTC-USD";
    }
    if (message.type === "error") {
      console.log(message);
    }
  };

  const toggleProduct = useCallback(
    (productId) => {
      const products = JSON.parse(localStorage.getItem("products"));
      let showProduct = !products[productId];

      sendJsonMessage(
        buildSubscribeMessage(showProduct ? "subscribe" : "unsubscribe", [
          productId,
        ])
      );

      const { [productId]: toggled, ...stable } = products;
      const newProducts = {
        ...stable,
        ...(showProduct ? { [productId]: productId } : {}),
      };

      localStorage.setItem("products", JSON.stringify(newProducts));

      setSelectedProducts(Object.keys(newProducts));
    },
    [sendJsonMessage, setSelectedProducts]
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
              price={prices[selectedProduct]}
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
