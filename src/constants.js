const SOCKET_STATUSES = {
  0: { name: "Connecting", class: "bg-blue-500", favicon: "img/yellow.png" },
  1: { name: "Connected", class: "bg-green-500", favicon: "img/green.png" },
  2: { name: "Closing", class: "bg-yellow-300", favicon: "img/yellow.png" },
  3: { name: "Closed", class: "bg-red-500", favicon: "img/red.png" },
};

const API_URL = "https://api.pro.coinbase.com";
const WS_URL = "wss://ws-feed.pro.coinbase.com";

const DEFAULT_SELECTED_PRODUCT_IDS = ["BTC-USD"];

export { SOCKET_STATUSES, API_URL, WS_URL, DEFAULT_SELECTED_PRODUCT_IDS };
