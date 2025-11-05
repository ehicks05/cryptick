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

const getHistoricPricesForProducts = async (productIds: string[]) => {
	const WINDOW = CandleGranularity.ONE_MINUTE * 300;

	const promises = Object.entries(CHART_TIMESPAN_SECONDS).map(
		async ([, seconds]) => {
			const candles = await getCandlesForProducts({
				productIds,
				granularity: CandleGranularity.ONE_MINUTE,
				start: toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW)),
				end: toUnixTimestamp(subSeconds(new Date(), seconds)),
			});

			return candles;
		},
	);

	const [day1Candles, day7Candles, day30Candles, day365Candles] =
		await Promise.all(promises);

	return { day1Candles, day7Candles, day30Candles, day365Candles };
};

export const useHistoricPrices = (productIds: string[]) => {
	const query = useQuery({
		queryKey: ['historicCandles', productIds],
		queryFn: () => getHistoricPricesForProducts(productIds),
		staleTime: 1000 * 60,
		refetchInterval: getMsToNextMinuteStart,
	});

	return query;
};
