import { useQuery } from '@tanstack/react-query';
import { useCandleGranularity, useChartTimespan } from '@/hooks/useStorage';
import { getTimeAgo, msToNextMinute, toUnixTimestamp } from '@/lib/date';
import {
	CHART_TIMESPAN_GRANULARITIES,
	CHART_TIMESPAN_SECONDS,
	EXCHANGES,
} from '@/types';
import { getCandlesForProducts } from './cbp/endpoints/candles';
import type { CandleGranularity } from './cbp/types/product';
import { getOhlcsForProducts } from './kraken/ohlc';
import { removeExchange } from './utils';

interface Params {
	productIds: string[];
	granularity: CandleGranularity;
	start: number;
	end: number;
}

const queryExchanges = async ({ productIds, granularity, start, end }: Params) => {
	const [coinbaseCandles, krakenCandles] = await Promise.all([
		getCandlesForProducts({
			productIds: productIds
				.filter((p) => p.startsWith(EXCHANGES.coinbase))
				.map(removeExchange),
			granularity,
			start,
			end,
		}),
		getOhlcsForProducts({
			pairs: productIds
				.filter((p) => p.startsWith(EXCHANGES.kraken))
				.map(removeExchange),
			interval: granularity,
			since: toUnixTimestamp(new Date(start)),
		}),
	]);

	return {
		...coinbaseCandles,
		...krakenCandles,
	};
};

/**
 * Uses the selected chartTimespan (1d, 1w, etc...) to pick a granularity
 * and time range to fetch.
 */
export const useCandles = (productIds: string[]) => {
	const { timespan } = useChartTimespan();
	const granularity = CHART_TIMESPAN_GRANULARITIES[timespan];
	const start = getTimeAgo(CHART_TIMESPAN_SECONDS[timespan]);
	const end = toUnixTimestamp(new Date());

	return useQuery({
		queryKey: ['candles', granularity, productIds],
		queryFn: () => queryExchanges({ productIds, granularity, start, end }),
		staleTime: 1000 * 60,
		refetchOnWindowFocus: 'always',
		refetchInterval: msToNextMinute,
	});
};

/**
 * Uses the selected granularity directly to power the product detail view.
 */
export const useCandlesByGranularity = (productIds: string[]) => {
	const { granularity } = useCandleGranularity();

	const start = getTimeAgo(granularity * 300);
	const end = toUnixTimestamp(new Date());

	return useQuery({
		queryKey: ['candlesByGranularity', granularity, productIds],
		queryFn: () => queryExchanges({ productIds, granularity, start, end }),
		staleTime: 1000 * 60,
		refetchInterval: msToNextMinute,
	});
};
