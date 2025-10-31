import { useLocalStorage } from 'usehooks-ts';
import { APP, DEFAULT } from '../constants';

// convenience function to prepend app name to any localStorage values,
// mainly useful on localhost
const useStorage = <T>(key: string, initialValue: T) =>
	useLocalStorage<T>(`${APP.NAME}-${key}`, initialValue);

export const useCandleGranularity = () =>
	useStorage('candle-granularity', DEFAULT.CANDLE_GRANULARITY);

export const useChartHeight = () => useStorage('chart-height', DEFAULT.CHART_HEIGHT);

export const useProductIds = () =>
	useStorage('product-ids', DEFAULT.SELECTED_PRODUCT_IDS);

export type SizeUnit = 'base' | 'quote';

export const useHistoryUnit = () => {
	const [sizeUnit, setSizeUnit] = useStorage<SizeUnit>('history-size-unit', 'base');
	const toggleSizeUnit = () => setSizeUnit(sizeUnit === 'base' ? 'quote' : 'base');

	return { sizeUnit, toggleSizeUnit };
};
