import type { WebSocketTickerMessage } from 'api/types/ws-types';
import useWebSocket from 'react-use-websocket';
import { useStore } from 'store';
import { useProductIds } from '../hooks/useStorage';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { WS_URL } from './constants';
import { useProducts } from './useProducts';

// Singleton
export const useTicker = () => {
	const [productIds] = useProductIds();
	const { data: products } = useProducts();

	const addTickerMessage = useStore((state) => state.addTickerMessage);

	const { sendMessage } = useWebSocket(WS_URL, {
		onOpen: () => sendMessage(buildSubscribeMessage('subscribe', productIds)),
		onMessage: (event) => handleMessage(JSON.parse(event.data)),
		onError: (event) => console.log(event),
		shouldReconnect: () => true,
		retryOnError: true,
		reconnectAttempts: 50,
		reconnectInterval: 2000,
		share: true,
	});

	const handleMessage = (message: WebSocketTickerMessage) => {
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
};
