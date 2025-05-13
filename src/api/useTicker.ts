import type { WebSocketTickerMessage } from 'api/types/ws-types';
import useWebSocket from 'react-use-websocket';
import useStore from 'store';
import { useProductIds } from '../hooks/useProductIds';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { WS_URL } from './constants';
import { useProducts } from './useProducts';

export const useTicker = () => {
  const [productIds] = useProductIds();
  const { data: products } = useProducts();

  const addTickerMessage = useStore(state => state.addTickerMessage);

  const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () =>
      sendJsonMessage(buildSubscribeMessage('subscribe', productIds)),
    filter: message => message.type === 'ticker',
    onMessage: event => handleMessage(JSON.parse(event.data)),
    onError: event => console.log(event),
    shouldReconnect: () => true,
    retryOnError: true,
    reconnectAttempts: 50,
    reconnectInterval: 2000,
  });

  const handleMessage = (message: WebSocketTickerMessage) => {
    // if (
    // 	ticker[message.product_id]?.map((t) => t.sequence).includes(message.sequence)
    // ) {
    // 	return;
    // }

    const { product_id: productId, price: rawPrice } = message;
    const product = products?.[productId];
    if (!product) return;

    const price = formatPrice(Number(rawPrice), product.minimumQuoteDigits);

    const { sequence, time, side, last_size } = message;

    addTickerMessage({
      productId,
      sequence,
      time: formatTime(new Date(time)),
      side,
      price,
      last_size: formatPrice(Number(last_size), product.minimumBaseDigits),
    });

    if (productId === productIds[0]) {
      document.title = `${price} ${productId}`;
    }
  };

  return {
    sendJsonMessage,
    readyState,
  };
};
