import type { SpotWebsocketStreams } from '@binance/spot';
import { useProductIds } from 'hooks/useStorage';
import { formatPrice, formatTime } from 'lib/format';
import useWebSocket from 'react-use-websocket';
import { OrderSide } from 'services/cbp/types/common';
import type { TickerMessage } from 'services/cbp/types/ws-types';
import { useExchangeInfo } from 'services/useExchangeInfo';
import { useStore } from 'store';
import type { CryptickProduct } from 'types';
import { WS_URL } from './constants';
import { buildBinanceMessage } from './utils';

type WebSocketTickerMessage = Required<SpotWebsocketStreams.AggTradeResponse>;

const toTickerMessage = (
	o: WebSocketTickerMessage,
	product: CryptickProduct,
): TickerMessage => {
	return {
		productId: `binance:${o.s}`,
		sequence: 0,
		time: formatTime(new Date(Number(o.T))),
		side: o.m ? OrderSide.BUY : OrderSide.SELL,
		price: formatPrice(Number(o.p), product.minQuoteDigits),
		last_size: formatPrice(Number(o.q), product.minBaseDigits),
	};
};

// Singleton
export const useBinanceTicker = () => {
	const { data } = useExchangeInfo();
	const products = data?.products;

	const { productIds } = useProductIds();
	const shouldConnect = productIds.some((id) => id.includes('binance'));

	const addTickerMessage = useStore((state) => state.addTickerMessage);

	const { sendMessage } = useWebSocket(
		WS_URL,
		{
			onOpen: () => sendMessage(buildBinanceMessage(true, productIds)),
			onMessage: (event) => handleMessage(JSON.parse(event.data)),
			onError: (event) => console.log(event),
			shouldReconnect: () => true,
			retryOnError: true,
			reconnectAttempts: 50,
			reconnectInterval: 2000,
			share: true,
		},
		shouldConnect,
	);

	const handleMessage = (message: WebSocketTickerMessage) => {
		const { s: symbol } = message;
		const productId = `binance:${symbol}`;
		const product = products?.[productId];
		if (!product) return;

		const tickerMessage = toTickerMessage(message, product);

		addTickerMessage(tickerMessage);

		if (productId === productIds[0]) {
			document.title = `${tickerMessage.price} ${symbol}`;
		}
	};
};
