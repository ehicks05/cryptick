import { keyBy } from 'lodash';
import useWebSocket from 'react-use-websocket';

import {
	useLocalStorage,
	useThrottle,
	useVisibilityChange,
} from '@uidotdev/usehooks';
import { TickerMessage, WebSocketTickerMessage } from 'api/types/ws-types';
import { useProductIds } from 'hooks/useProductIds';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { WS_URL } from './constants';
import { use24HourStats } from './use24HourStats';
import { useProducts } from './useProducts';

export const useTicker = () => {
	const [productIds] = useProductIds();
	const { data: products } = useProducts();
	const { data: stats } = use24HourStats();
	const [ticker, setTicker] = useLocalStorage<Record<string, TickerMessage[]>>(
		'crypto-ticker-ticker',
		{},
	);
	const isVisible = useVisibilityChange();

	const { sendJsonMessage } = useWebSocket(
		WS_URL,
		{
			onOpen: () => {
				sendJsonMessage(buildSubscribeMessage('subscribe', productIds));
			},
			onMessage: (event) => handleMessage(JSON.parse(event.data)),
			onError: (event) => console.log(event),
			shouldReconnect: (_closeEvent) => true,
			retryOnError: true,
			reconnectAttempts: 50,
			reconnectInterval: 2000,
			share: true,
			filter: (_messageEvent) => false,
		},
		isVisible,
	);

	const handleMessage = (message: WebSocketTickerMessage) => {
		if (!products || Object.keys(products).length === 0) return;
		if (message.type !== 'ticker') return;
		if (
			ticker[message.product_id]?.map((t) => t.sequence).includes(message.sequence)
		) {
			return;
		}

		const { product_id: productId, price: rawPrice } = message;

		const price = formatPrice(
			Number(rawPrice),
			products[productId].minimumQuoteDigits,
		);

		if (productId === productIds[0])
			document.title = `${price} ${products[productIds[0]].display_name}`;

		const { sequence, time, side, last_size } = message;
		if (!time) return;

		const newMessage = {
			productId,
			sequence,
			time: formatTime(new Date(time)),
			side,
			price,
			last_size: formatPrice(
				Number(last_size),
				products[productId].minimumBaseDigits,
			),
		};
		setTicker({
			...ticker,
			[productId]: [newMessage, ...(ticker[productId] || [])].slice(0, 64),
		});
	};

	const prices = useThrottle(
		keyBy(
			productIds.map((productId) => {
				const priceFromTicker = ticker[productId]?.[0].price;
				const priceFromStats = formatPrice(
					stats?.[productId]?.last || 0,
					products?.[productId]?.minimumQuoteDigits || 0,
				);
				const price = priceFromTicker ?? priceFromStats;
				return { productId, price };
			}),
			(o) => o.productId,
		),
		100,
	);

	return {
		ticker,
		prices,
		sendJsonMessage,
	};
};
