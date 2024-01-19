import _ from 'lodash';
import useWebSocket from 'react-use-websocket';

import { SOCKET_STATUSES, WS_URL } from './constants';
import { buildSubscribeMessage, formatPrice, formatTime } from '../utils';
import { TickerMessage, WebSocketTickerMessage } from 'api/types/ws-types';
import { useProductIds } from 'hooks/useProductIds';
import { useProducts } from './useProducts';
import { useMemo, useState } from 'react';
import { useThrottle } from '@uidotdev/usehooks';

export const useTicker = () => {
	const [productIds] = useProductIds();
	const productsQuery = useProducts();
	const products = productsQuery.data;
	const [ticker, setTicker] = useState<Record<string, TickerMessage[]>>({});
	const [prices, setPrices] = useState<Record<string, { price: string }>>({});

	const throttledPrices = useThrottle(prices, 1000);

	const { sendJsonMessage, readyState } = useWebSocket(
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

	const socketStatus = useMemo(() => SOCKET_STATUSES[readyState], [readyState]);

	const handleMessage = (message: WebSocketTickerMessage) => {
		if (!products || Object.keys(products).length === 0) return;
		if (message.type !== 'ticker') return;
		const { product_id: productId, price: rawPrice } = message;

		const price = formatPrice(
			Number(rawPrice),
			products[productId].minimumQuoteDigits,
		);

		setPrices({
			...prices,
			[productId]: { price },
		});

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
			[productId]: _.take([newMessage, ...(ticker[productId] || [])], 100),
		});
	};

	return {
		ticker,
		unthrottledPrices: prices,
		prices: throttledPrices,
		setPrices,
		throttledPrices,
		sendJsonMessage,
		socketStatus,
	};
};
