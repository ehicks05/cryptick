import { useThrottle } from '@uidotdev/usehooks';
import type { TickerMessage } from 'api/types/ws-types';
import { useEffect, useState } from 'react';
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
		set((state) => ({
			ticker: {
				...state.ticker,
				[data.productId]: [data, ...(state.ticker[data.productId] || [])].slice(
					0,
					64,
				),
			},
		})),
}));

export const usePrice = (productId: string) => {
	const price = useStore((state) => state.ticker[productId]?.[0]?.price);
	return price;
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
