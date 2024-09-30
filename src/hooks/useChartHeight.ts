import { useLocalStorage } from '@uidotdev/usehooks';
import { DEFAULT_CHART_HEIGHT } from '../constants';

export const useChartHeight = () => {
	return useLocalStorage('crypto-ticker-chart-height', DEFAULT_CHART_HEIGHT);
};
