import { useThrottle } from '@uidotdev/usehooks';
import { formatPrice } from 'lib/format';
import type { TickerMessage } from 'services/cbp/types/ws-types';
import { useCandles } from 'services/useCandles';
import { useExchangeInfo } from 'services/useExchangeInfo';
import { create } from 'zustand';

export interface AppState {
	ticker: Record<string, TickerMessage[]>;
	addTickerMessage: (data: TickerMessage) => void;
}

export const useStore = create<AppState>((set) => ({
	ticker: {},
	addTickerMessage: (data) =>
		set((state) => ({ ticker: mergeTicker(state.ticker, data) })),
}));

const mergeTicker = (
	ticker: Record<string, TickerMessage[]>,
	message: TickerMessage,
) => ({
	...ticker,
	[message.productId]: [message, ...(ticker[message.productId] || [])].slice(0, 80),
});

export const usePrice = (productId: string) => {
	const price = useStore((state) => state.ticker[productId]?.[0]?.price);
	const { data: candles } = useCandles([productId]);

	const { data: exchangeInfo } = useExchangeInfo();
	const product = exchangeInfo?.products?.[productId];

	// use candle data until a ticker trade comes in
	const _last = candles?.[productId]?.[0].close || 0;
	const last = _last ? formatPrice(_last, product?.minQuoteDigits || 0) : '';

	return price || last;
};

export const useThrottledPrice = (productId: string) => {
	const _price = usePrice(productId);
	const price = useThrottle(_price || '0', 500);
	return price;
};
