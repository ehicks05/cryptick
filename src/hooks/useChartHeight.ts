import { useLocalStorage } from '@uidotdev/usehooks';
import { APP_NAME, DEFAULT_CHART_HEIGHT } from '../constants';

export const useChartHeight = () => {
	return useLocalStorage(`${APP_NAME}-chart-height`, DEFAULT_CHART_HEIGHT);
};
