import type { CandleGranularity } from 'services/cbp/types/product';
import type { ChartTimespan, SizeUnit } from 'types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { APP } from '../constants';
import { DEFAULT } from './constants';

interface CryptickStore {
	candleGranularity: CandleGranularity; // granularity for productDetail chart
	chartTimespan: ChartTimespan; // timespan for products view
	chartHeight: string;
	productIds: string[];
	historySizeUnit: SizeUnit;

	setCandleGranularity: (candleGranularity: CandleGranularity) => void;
	setChartTimespan: (chartTimespan: ChartTimespan) => void;
	setChartHeight: (chartHeight: string) => void;
	setProductIds: (productIds: string[]) => void;
	toggleHistorySizeUnit: () => void;
}

const useCryptickStore = create<CryptickStore>()(
	persist(
		(set) => ({
			candleGranularity: DEFAULT.CANDLE_GRANULARITY,
			chartTimespan: DEFAULT.CHART_TIMESPAN,
			chartHeight: DEFAULT.CHART_HEIGHT,
			productIds: DEFAULT.SELECTED_PRODUCT_IDS,
			historySizeUnit: 'base',

			setCandleGranularity: (candleGranularity: CandleGranularity) =>
				set({ candleGranularity }),
			setChartTimespan: (chartTimespan: ChartTimespan) => set({ chartTimespan }),
			setChartHeight: (chartHeight: string) => set({ chartHeight }),
			setProductIds: (productIds: string[]) => set({ productIds }),
			toggleHistorySizeUnit: () =>
				set((store) => ({
					historySizeUnit: store.historySizeUnit === 'base' ? 'quote' : 'base',
				})),
		}),
		{
			name: `${APP.NAME}-storage`,
			version: 1,
			migrate: (persistedState, version) => {
				if (version === 0) {
					if (
						persistedState === null ||
						typeof persistedState !== 'object' ||
						'productIds' in persistedState === false ||
						persistedState.productIds === null ||
						Array.isArray(persistedState.productIds) === false
					)
						return;

					persistedState.productIds = persistedState.productIds.map(
						(productId: string) => `coinbase:${productId}`,
					);
				}
			},
		},
	),
);

export const useCandleGranularity = () =>
	useCryptickStore(
		useShallow((state) => ({
			granularity: state.candleGranularity,
			setGranularity: state.setCandleGranularity,
		})),
	);

export const useChartTimespan = () =>
	useCryptickStore(
		useShallow((state) => ({
			timespan: state.chartTimespan,
			setTimespan: state.setChartTimespan,
		})),
	);

export const useChartHeight = () =>
	useCryptickStore(
		useShallow((state) => ({
			chartHeight: state.chartHeight,
			setChartHeight: state.setChartHeight,
		})),
	);

export const useProductIds = () =>
	useCryptickStore(
		useShallow((state) => ({
			productIds: state.productIds,
			setProductIds: state.setProductIds,
		})),
	);

export const useHistorySizeUnit = () =>
	useCryptickStore(
		useShallow((state) => ({
			sizeUnit: state.historySizeUnit,
			toggleSizeUnit: state.toggleHistorySizeUnit,
		})),
	);
