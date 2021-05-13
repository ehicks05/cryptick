const SOCKET_STATUSES = {
  "-1": { name: "Uninstantiated", class: "bg-red-500" },
  0: { name: "Connecting", class: "bg-blue-500" },
  1: { name: "Connected", class: "bg-green-500" },
  2: { name: "Closing", class: "bg-yellow-300" },
  3: { name: "Closed", class: "bg-red-500" },
};

const API_URL = "https://api.pro.coinbase.com";
const WS_URL = "wss://ws-feed.pro.coinbase.com";

const DEFAULT_SELECTED_PRODUCT_IDS = ["BTC-USD", "ETH-USD", "LTC-USD"];

export { SOCKET_STATUSES, API_URL, WS_URL, DEFAULT_SELECTED_PRODUCT_IDS };
