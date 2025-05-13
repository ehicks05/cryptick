const REST_URL = 'https://api.exchange.coinbase.com';
const WS_URL = 'wss://ws-feed.exchange.coinbase.com';

const CURRENCY_URL = `${REST_URL}/currencies`;
const PRODUCT_URL = `${REST_URL}/products`;

const SOCKET_STATUSES = {
  '-1': { name: 'Uninstantiated', class: 'bg-red-500' },
  '0': { name: 'Connecting', class: 'bg-blue-500' },
  '1': { name: 'Connected', class: 'bg-green-500' },
  '2': { name: 'Closing', class: 'bg-yellow-300' },
  '3': { name: 'Closed', class: 'bg-red-500' },
} as const;

export { WS_URL, SOCKET_STATUSES, CURRENCY_URL, PRODUCT_URL };
