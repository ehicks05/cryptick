import { getChange } from 'lib/math';
import { useThrottledPrice } from 'store';
import { CHART_TIMESPANS, type ChartTimespan, type Direction } from 'types';
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

	const day1 = data?.day1Candles[productId]?.[0]?.open || 0;
	const day1Change = getChange(day1, Number(price));

	const day7 = data?.day7Candles[productId]?.[0]?.open || 0;
	const day7Change = getChange(day7, Number(price));

	const day30 = data?.day30Candles[productId]?.[0]?.open || 0;
	const day30Change = getChange(day30, Number(price));

	const day365 = data?.day365Candles[productId]?.[0]?.open || 0;
	const day365Change = getChange(day365, Number(price));

	const performances: Performance[] = [
		{ name: CHART_TIMESPANS['24H'], label: 'D', ...day1Change },
		{ name: CHART_TIMESPANS['7D'], label: 'W', ...day7Change },
		{ name: CHART_TIMESPANS['30D'], label: 'M', ...day30Change },
		{ name: CHART_TIMESPANS['1Y'], label: 'Y', ...day365Change },
	];

	return { performances };
};
