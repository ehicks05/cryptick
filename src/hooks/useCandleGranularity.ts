import { useLocalStorage } from '@uidotdev/usehooks';
import { APP_NAME, DEFAULT_CANDLE_GRANULARITY } from '../constants';

export const useCandleGranularity = () => {
	return useLocalStorage(
		`${APP_NAME}-candle-granularity`,
		DEFAULT_CANDLE_GRANULARITY,
	);
};
