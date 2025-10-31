import { useLocalStorage } from 'usehooks-ts';
import {
	APP,
	DEFAULT_CANDLE_GRANULARITY,
	DEFAULT_CHART_HEIGHT,
	DEFAULT_SELECTED_PRODUCT_IDS,
} from '../constants';

// convenience function to prepend app name to any localStorage values,
// mainly useful on localhost
const useStorage = <T>(key: string, initialValue: T) =>
	useLocalStorage<T>(`${APP.NAME}-${key}`, initialValue);

export const useCandleGranularity = () =>
	useStorage('candle-granularity', DEFAULT_CANDLE_GRANULARITY);

export const useChartHeight = () => useStorage('chart-height', DEFAULT_CHART_HEIGHT);

export const useProductIds = () =>
	useStorage('product-ids', DEFAULT_SELECTED_PRODUCT_IDS);

export type SizeUnit = 'base' | 'quote';

export const useHistoryUnit = () => {
	const [sizeUnit, setSizeUnit] = useStorage<SizeUnit>('history-size-unit', 'base');
	const toggleSizeUnit = () => setSizeUnit(sizeUnit === 'base' ? 'quote' : 'base');

	return { sizeUnit, toggleSizeUnit };
};
