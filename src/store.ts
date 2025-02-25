import { useThrottle } from '@uidotdev/usehooks';
import { use24HourStats, useProducts } from 'api';
import type { TickerMessage } from 'api/types/ws-types';
import { useEffect, useState } from 'react';
import { formatPrice } from 'utils';
import { create } from 'zustand';

export interface AppState {
	isShowSettings: boolean;
	setIsShowSettings: (data: boolean) => void;
	ticker: Record<string, TickerMessage[]>;
	addTickerMessage: (data: TickerMessage) => void;
}

const useStore = create<AppState>((set) => ({
	isShowSettings: false,
	setIsShowSettings: (data) => set({ isShowSettings: data }),
	ticker: {},
	addTickerMessage: (data) =>
		set((state) => ({ ticker: mergeTicker(state.ticker, data) })),
}));

const mergeTicker = (
	ticker: Record<string, TickerMessage[]>,
	message: TickerMessage,
) => ({
	...ticker,
	[message.productId]: [message, ...(ticker[message.productId] || [])].slice(0, 64),
});

export const usePrice = (productId: string) => {
	const price = useStore((state) => state.ticker[productId]?.[0]?.price);

	// fall back to 24-hour stats in case ticker is empty
	const { data: products } = useProducts();
	const { data: stats } = use24HourStats();
	const product = products?.[productId];
	const last = formatPrice(
		stats?.[productId]?.last || 0,
		product?.minimumQuoteDigits || 0,
	);
	return price || last;
};

export const subscribeToPrice = (productId: string) => {
	// Fetch initial state
	const [price, setPrice] = useState(usePrice(productId));
	// Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
	useEffect(
		() =>
			useStore.subscribe((state) => setPrice(state.ticker[productId]?.[0]?.price)),
		[productId],
	);

	return price;
};

export const useThrottledPrice = (productId: string) => {
	const _price = subscribeToPrice(productId);
	const price = useThrottle(_price || '0', 500);
	return price;
};

export default useStore;
