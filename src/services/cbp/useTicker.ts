import { useProductIds } from 'hooks/useStorage';
import { formatPrice, formatTime } from 'lib/format';
import useWebSocket from 'react-use-websocket';
import type { WebSocketTickerMessage } from 'services/cbp/types/ws-types';
import { useStore } from 'store';
import { WS_URL } from './constants';
import { useProducts } from './hooks';
import { buildSubscribeMessage } from './utils';

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

		const price = formatPrice(Number(rawPrice), product.minQuoteDigits);

		const { sequence, time, side, last_size } = message;

		addTickerMessage({
			productId,
			sequence,
			time: formatTime(new Date(time)),
			side,
			price,
			last_size: formatPrice(Number(last_size), product.minBaseDigits),
		});

		if (productId === productIds[0]) {
			document.title = `${price} ${productId}`;
		}
	};
};
