import { DEFAULT_CANDLE_GRANULARITY } from '../constants';
import { useLocalStorage } from './useLocalStorage';

export const useCandleGranularity = () =>
	useLocalStorage('candle-granularity', DEFAULT_CANDLE_GRANULARITY);
