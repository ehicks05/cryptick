import { getChange } from 'lib/math';
import { CHART_TIMESPANS, type ChartTimespan, type Direction } from 'types';
import { useHistoricPrices } from './useHistoricPrices';

export interface Performance {
	name: ChartTimespan;
	label: string;
	direction: Direction;
	percentChange: number;
}

export const useHistoricPerformance = ({ productId }: { productId: string }) => {
	const { data } = useHistoricPrices([productId]);

	const latest = data?.latestCandles[productId][0]?.open || 0;

	const day1 = data?.day1Candles[productId][0]?.open || 0;
	const day1Change = getChange(day1, latest);

	const day7 = data?.day7Candles[productId][0]?.open || 0;
	const day7Change = getChange(day7, latest);

	const day30 = data?.day30Candles[productId][0]?.open || 0;
	const day30Change = getChange(day30, latest);

	const day365 = data?.day365Candles[productId][0]?.open || 0;
	const day365Change = getChange(day365, latest);

	const performances: Performance[] = [
		{ name: CHART_TIMESPANS['24H'], label: 'D', ...day1Change },
		{ name: CHART_TIMESPANS['7D'], label: 'W', ...day7Change },
		{ name: CHART_TIMESPANS['30D'], label: 'M', ...day30Change },
		{ name: CHART_TIMESPANS['1Y'], label: 'Y', ...day365Change },
	];

	return { performances };
};
