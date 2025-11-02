import { useQuery } from '@tanstack/react-query';
import { useChartTimespan } from 'hooks/useStorage';
import { useEffect } from 'react';
import { CHART_TIMESPAN_GRANULARITIES, CHART_TIMESPAN_SECONDS } from 'types';
import { getCandlesForProducts } from './endpoints/candles';
import { CandleGranularity } from './types/product';
import {
	getMsToNextMinuteStart,
	getTimeAgo,
	subSeconds,
	toUnixTimestamp,
} from './utils';

export const useCandles = (productIds: string[]) => {
	const [timespan] = useChartTimespan();
	const granularity = CHART_TIMESPAN_GRANULARITIES[timespan];
	const start = getTimeAgo(CHART_TIMESPAN_SECONDS[timespan]);
	const end = toUnixTimestamp(new Date());

	const query = useQuery({
		queryKey: ['candles', productIds],
		queryFn: () => getCandlesForProducts({ productIds, granularity, start, end }),
		staleTime: 1000 * 60,
		refetchInterval: getMsToNextMinuteStart,
	});

	useEffect(() => {
		if (granularity) query.refetch();
	}, [granularity, query.refetch]);

	return query;
};

// if there are no candles exactly 30 days ago, look for anything in the next hour
const WINDOW = 60 * 60;

const getHistoricPerformanceForProducts = async (productIds: string[]) => {
	const granularity = CandleGranularity.ONE_MINUTE;

	const promises = Object.entries(CHART_TIMESPAN_SECONDS).map(
		async ([timespan, seconds]) => {
			const start = toUnixTimestamp(subSeconds(new Date(), seconds));
			const end = toUnixTimestamp(subSeconds(new Date(), seconds - WINDOW));

			const candles = await getCandlesForProducts({
				productIds,
				granularity,
				start,
				end,
			});

			return candles;
		},
	);

	const [day1Candles, day7Candles, day30Candles, day365Candles] =
		await Promise.all(promises);

	return { day1Candles, day7Candles, day30Candles, day365Candles };
};

export const useHistoricPerformance = (productIds: string[]) => {
	const query = useQuery({
		queryKey: ['historicCandles', productIds],
		queryFn: () => getHistoricPerformanceForProducts(productIds),
		staleTime: 1000 * 60,
		refetchInterval: getMsToNextMinuteStart,
	});

	return query;
};
