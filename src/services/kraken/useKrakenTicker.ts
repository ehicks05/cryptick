import { useProductIds } from 'hooks/useStorage';
import { formatPrice, formatTime } from 'lib/format';
import useWebSocket from 'react-use-websocket';
import { OrderSide } from 'services/cbp/types/common';
import type { TickerMessage } from 'services/cbp/types/ws-types';
import { useExchangeInfo } from 'services/useExchangeInfo';
import { useStore } from 'store';
import type { CryptickProduct } from 'types';
import { WS_URL } from './constants';
import type { WsTrade, WsTradesResponse } from './types';
import { buildKrakenMessage } from './utils';

const toTickerMessage = (
	trade: WsTrade,
	product: CryptickProduct,
): TickerMessage => {
	return {
		productId: product.id,
		sequence: 0,
		time: formatTime(new Date(trade.timestamp)),
		side: trade.side === 'buy' ? OrderSide.BUY : OrderSide.SELL,
		price: formatPrice(trade.price, product.minQuoteDigits),
		last_size: formatPrice(trade.qty, product.minBaseDigits),
	};
};

// Singleton
export const useKrakenTicker = () => {
	const { data } = useExchangeInfo();
	const products = data?.products;

	const { productIds } = useProductIds();
	const krakenProductIds = productIds.filter((id) => id.includes('kraken'));
	const shouldConnect = krakenProductIds.length > 0;
	const wsProductIds = krakenProductIds.map(
		(productId) => `kraken:${products?.[productId].wsName || ''}`,
	);

	const addTickerMessage = useStore((state) => state.addTickerMessage);

	const { sendMessage } = useWebSocket(
		WS_URL,
		{
			onOpen: () => sendMessage(buildKrakenMessage(true, wsProductIds)),
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

	const findByWsName = (products: Record<string, CryptickProduct>, wsName: string) =>
		Object.values(products).find((product) => product.wsName === wsName);

	const handleTrade = (trade: WsTrade) => {
		const { symbol } = trade;
		const productId = `kraken:${symbol}`;
		const product = findByWsName(products || {}, symbol);
		if (!product) return;

		const tickerMessage = toTickerMessage(trade, product);

		addTickerMessage(tickerMessage);

		if (productId === productIds[0]) {
			document.title = `${tickerMessage.price} ${symbol}`;
		}
	};

	const handleMessage = (tradesResponse: WsTradesResponse) => {
		if (tradesResponse.channel === 'trade') {
			tradesResponse.data.forEach(handleTrade);
		}
	};
};
