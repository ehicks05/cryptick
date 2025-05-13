const REST_URL = 'https://api.exchange.coinbase.com';
const WS_URL = 'wss://ws-feed.exchange.coinbase.com';

const CURRENCY_URL = `${REST_URL}/currencies`;
const PRODUCT_URL = `${REST_URL}/products`;

export interface SocketStatus {
  name: string;
  class: { text: string; bg: string };
}

const SOCKET_STATUSES: Record<string, SocketStatus> = {
  '-1': {
    name: 'Uninstantiated',
    class: { text: 'text-red-500', bg: 'bg-red-500' },
  },
  '0': {
    name: 'Connecting',
    class: { text: 'text-blue-500', bg: 'bg-blue-500' },
  },
  '1': {
    name: 'Connected',
    class: { text: 'text-green-500', bg: 'bg-green-500' },
  },
  '2': {
    name: 'Closing',
    class: { text: 'text-yellow-300', bg: 'bg-yellow-300' },
  },
  '3': { name: 'Closed', class: { text: 'text-red-500', bg: 'bg-red-500' } },
} as const;

export { WS_URL, SOCKET_STATUSES, CURRENCY_URL, PRODUCT_URL };
