import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import useInterval from "@use-it/interval";
import { getProducts, get24HourStats } from "./api";
import { SOCKET_STATUSES } from "./constants";
import { getPrettyPrice } from "./utils";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [stats, setStats] = useState({});

  const WS_URL = "wss://ws-feed.pro.coinbase.com";
  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => console.log("opened"),
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
    sendJsonMessage(buildSubUnsubMessage("subscribe", selectedProductIds));

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
    const set = async () => setProducts(await getProducts());
    set();
  }, []);

  useEffect(() => {
    document.getElementById("favicon").href =
      SOCKET_STATUSES[readyState].favicon;
  }, [readyState]);

  const buildSubUnsubMessage = (type, product_ids) => {
    return { type, product_ids, channels: ["ticker"] };
  };

  const flashPriceColorChange = (newPrice, lastPrice, priceElement) => {
    if (newPrice === lastPrice) return;
    priceElement.classList.remove("green", "red");

    // force animation restart (https://css-tricks.com/restart-css-animation/)
    void priceElement.offsetWidth;

    const color = newPrice > lastPrice ? "green" : "red";
    priceElement.classList.add(color);
  };

  const handleMessage = (message) => {
    if (message.type === "ticker") {
      const productId = message.product_id;
      if (!prices[productId])
        setPrices({ ...prices, [productId]: { lastPrice: 0 } });

      const price = Number.parseFloat(message.price);
      const prettyPrice = getPrettyPrice(price);

      const priceEl = document.getElementById(`${productId}Price`);
      flashPriceColorChange(price, prices[productId]?.lastPrice, priceEl);

      const newPrices = {
        ...prices,
        [productId]: { lastPrice: price, prettyPrice },
      };
      setPrices(newPrices);

      if (productId === "BTC-USD") document.title = price + " BTC-USD";
    }
    if (message.type === "error") {
      console.log(message);
    }
  };

  const toggleProduct = (productId) => {
    const products = JSON.parse(localStorage.getItem("products"));
    let showProduct = !products[productId];

    sendJsonMessage(
      buildSubUnsubMessage(showProduct ? "subscribe" : "unsubscribe", [
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
  };

  return (
    <>
      <header>
        <div className="flex p-4 items-center justify-between">
          <div className="justify-start">
            <div
              title={SOCKET_STATUSES[readyState].name}
              className={`rounded-full h-4 w-4 ${SOCKET_STATUSES[readyState].class}`}
            />
          </div>
          <div className="justify-end">
            <div
              className="cursor-pointer"
              onClick={() => setShowSettings(!showSettings)}
            >
              {`settings[${showSettings ? "-" : "+"}]`}
            </div>
          </div>
        </div>
      </header>
      <div className={`p-4 ${showSettings ? "block" : "hidden"}`}>
        <Settings
          products={products}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
        />
      </div>
      <div className="flex flex-wrap p-4">
        {selectedProducts.map((selectedProduct) => {
          return (
            <ProductSection
              key={selectedProduct}
              productId={selectedProduct}
              prices={prices}
              stats={stats}
            />
          );
        })}
      </div>
      <div className="flex-grow"></div>
      <footer>
        <div className="flex flex-col md:flex-row p-4 items-end justify-end">
          <div className="  ">
            <span className="space-x-4">
              <a
                className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
                href="https://www.github.com/ehicks05/bitcoin-price-ticker/"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>
              <a
                className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
                href="https://ehicks.net"
              >
                ehicks
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

const Settings = ({ products, selectedProducts, toggleProduct }) => {
  return (
    <div className="my-1">
      <div>Trading Pairs: </div>
      <div className="flex flex-wrap w-full">
        {products.map((product) => {
          return (
            <ProductButton
              key={product.id}
              product={product}
              selected={selectedProducts.includes(product.id)}
              onClick={() => toggleProduct(product.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const ProductButton = ({ product, selected, onClick }) => {
  return (
    <button
      key={product.id}
      className={`whitespace-nowrap px-2 py-1 m-1 rounded cursor-pointer 
      ${
        selected
          ? "bg-green-500 text-gray-50"
          : "text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      {product.id}
    </button>
  );
};

const ProductSection = ({ productId, prices, stats }) => {
  return (
    <div className="w-56">
      <div className="text-gray-700 dark:text-gray-400">{productId}</div>
      <span className="text-2xl font-semibold" id={`${productId}Price`}>
        {prices[productId]?.prettyPrice}
      </span>
      <div className="text-xs">
        {stats[productId] &&
          Object.entries(stats[productId])
            .filter(([k, v]) => k !== "productId")
            .map(([k, v]) => {
              return (
                <div key={k}>
                  {k}: {Math.round(v)}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default App;
