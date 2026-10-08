import { getChange } from '@/lib/math';
import { useThrottledPrice } from '@/store';
import { CHART_TIMESPANS, type ChartTimespan, type Direction } from '@/types';
import { useHistoricPrices } from './useHistoricPrices';

export interface Performance {
	name: ChartTimespan;
	label: string;
	direction: Direction;
	percentChange: number;
}

export const useHistoricPerformance = ({ productId }: { productId: string }) => {
	const _price = useThrottledPrice(productId);
	const cleanPriceString = _price.replace(/[$,]/g, ''); // Removes '$' and ','
	const price = Number.parseFloat(cleanPriceString);

	const { data } = useHistoricPrices([productId]);

	const oneDayAgo = data?.oneDayAgoCandles[productId]?.[0]?.open || 0;
	const oneDayChange = getChange(oneDayAgo, Number(price));

	const oneWeekAgo = data?.oneWeekAgoCandles[productId]?.[0]?.open || 0;
	const oneWeekChange = getChange(oneWeekAgo, Number(price));

	const oneMonthAgo = data?.oneMonthAgoCandles[productId]?.[0]?.open || 0;
	const oneMonthChange = getChange(oneMonthAgo, Number(price));

	const oneYearAgo = data?.oneYearAgoCandles[productId]?.[0]?.open || 0;
	const oneYearChange = getChange(oneYearAgo, Number(price));

	const performances: Performance[] = [
		{ name: CHART_TIMESPANS['1D'], label: 'D', ...oneDayChange },
		{ name: CHART_TIMESPANS['1W'], label: 'W', ...oneWeekChange },
		{ name: CHART_TIMESPANS['1M'], label: 'M', ...oneMonthChange },
		{ name: CHART_TIMESPANS['1Y'], label: 'Y', ...oneYearChange },
	];

	return { performances };
};
