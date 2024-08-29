import { useLocalStorage, useVisibilityChange } from '@uidotdev/usehooks';
import type { TickerMessage, WebSocketTickerMessage } from 'api/types/ws-types';
import useWebSocket from 'react-use-websocket';
import { useProductIds } from '../hooks/useProductIds';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { SOCKET_STATUSES, WS_URL } from './constants';
import { use24HourStats } from './use24HourStats';
import { useProducts } from './useProducts';

const keyByProductId = (data: { productId: string; price: string }[]) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr;
			return agg;
		},
		{} as Record<string, { productId: string; price: string }>,
	);

export const useTicker = () => {
	const [productIds] = useProductIds();
	const { data: products } = useProducts();
	const { data: stats } = use24HourStats();
	const [ticker, setTicker] = useLocalStorage<Record<string, TickerMessage[]>>(
		'crypto-ticker-ticker',
		{},
	);
	const isVisible = useVisibilityChange();

	const { sendJsonMessage, readyState } = useWebSocket(
		WS_URL,
		{
			onOpen: () => {
				sendJsonMessage(buildSubscribeMessage('subscribe', productIds));
			},
			onMessage: (event) => handleMessage(JSON.parse(event.data)),
			onError: (event) => console.log(event),
			shouldReconnect: () => true,
			retryOnError: true,
			reconnectAttempts: 50,
			reconnectInterval: 2000,
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

	const prices = keyByProductId(
		productIds.map((productId) => {
			const priceFromTicker = ticker[productId]?.[0].price;
			const priceFromStats = formatPrice(
				stats?.[productId]?.last || 0,
				products?.[productId]?.minimumQuoteDigits || 0,
			);
			const price = priceFromTicker ?? priceFromStats;
			return { productId, price };
		}),
	);

	return {
		socketStatus: SOCKET_STATUSES[readyState],
		ticker,
		prices,
		sendJsonMessage,
	};
};
