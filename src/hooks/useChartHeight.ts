import { DEFAULT_CHART_HEIGHT } from '../constants';
import { useLocalStorage } from './useLocalStorage';

export const useChartHeight = () =>
	useLocalStorage('chart-height', DEFAULT_CHART_HEIGHT);
