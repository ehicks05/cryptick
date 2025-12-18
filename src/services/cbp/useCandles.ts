import { useQuery } from '@tanstack/react-query';
import { useCandleGranularity } from 'hooks/useStorage';
import { getTimeAgo, msToNextMinute, subSeconds, toUnixTimestamp } from 'lib/date';
import { useEffect } from 'react';
import { CHART_TIMESPAN_SECONDS } from 'types';
import { getCandlesForProducts } from './endpoints/candles';
import { CandleGranularity } from './types/product';

export const useCandlesByGranularity = (productIds: string[]) => {
	const { granularity } = useCandleGranularity();

	const start = getTimeAgo(granularity * 300);
	const end = toUnixTimestamp(new Date());

	const query = useQuery({
		queryKey: ['candlesByGranularity', productIds],
		queryFn: () => getCandlesForProducts({ productIds, granularity, start, end }),
		staleTime: 1000 * 60,
		refetchInterval: msToNextMinute,
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
		refetchInterval: msToNextMinute,
	});

	return query;
};
