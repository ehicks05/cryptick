import { keyBy, take } from 'lodash';
import useWebSocket from 'react-use-websocket';

import { WS_URL } from './constants';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { TickerMessage, WebSocketTickerMessage } from 'api/types/ws-types';
import { useProductIds } from 'hooks/useProductIds';
import { useProducts } from './useProducts';
import { useState } from 'react';
import { useThrottle } from '@uidotdev/usehooks';
import { use24HourStats } from './use24HourStats';

export const useTicker = () => {
	const [productIds] = useProductIds();
	const { data: products } = useProducts();
	const { data: stats } = use24HourStats();
	const [ticker, setTicker] = useState<Record<string, TickerMessage[]>>({});

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
		true,
	);

	const handleMessage = (message: WebSocketTickerMessage) => {
		if (!products || Object.keys(products).length === 0) return;
		if (message.type !== 'ticker') return;
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
			[productId]: take([newMessage, ...(ticker[productId] || [])], 100),
		});
	};

	const unthrottledPrices = productIds.map((productId) => {
		const price =
			ticker[productId]?.[0].price ||
			formatPrice(
				stats?.[productId]?.last || 0,
				products?.[productId]?.minimumQuoteDigits || 0,
			) ||
			0;

		return { productId, price };
	});

	const prices = useThrottle(
		keyBy(unthrottledPrices, (o) => o.productId),
		1000,
	);

	return {
		ticker,
		prices,
		sendJsonMessage,
	};
};
