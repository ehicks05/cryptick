import { useQuery } from '@tanstack/react-query';
import { useChartTimespan } from 'hooks/useStorage';
import pThrottle from 'p-throttle';
import { useEffect } from 'react';
import { CHART_TIMESPAN_GRANULARITIES } from 'types';
import { PRODUCT_URL } from './constants';
import { type Candle, CandleGranularity, type RawCandle } from './types/product';
import {
	getMsToNextMinuteStart,
	getTimeAgo,
	keyByProductId,
	subSeconds,
	toUnixTimestamp,
} from './utils';

interface Params {
	productId: string;
	granularity: CandleGranularity;
	start?: number;
	end?: number;
}

const getCandlesForProduct = async ({
	productId,
	granularity,
	start,
	end,
}: Params): Promise<Candle[]> => {
	const url = `${PRODUCT_URL}/${productId}/candles`;
	const query = new URLSearchParams({
		granularity: String(granularity),
		start: String(start) || '',
		end: String(end) || '',
	});

	try {
		const response = await fetch(`${url}?${query}`);
		const json: RawCandle[] = await response.json();
		return json.map((candle) => ({
			productId,
			timestamp: candle[0] * 1000,
			low: candle[1],
			high: candle[2],
			open: candle[3],
			close: candle[4],
			volume: candle[5],
		}));
	} catch (err) {
		console.log(err);
		return [];
	}
};

const throttle = pThrottle({
	limit: 10,
	interval: 1000,
});

const getCandlesForProducts = async (
	productIds: string[],
	granularity: CandleGranularity,
	start: number,
	end: number,
) => {
	const throttledFetch = throttle(
		async (productId: string, start: number, end?: number) => {
			const candles = await getCandlesForProduct({
				productId,
				granularity,
				start,
				end,
			});
			return { productId, candles };
		},
	);

	const data = (
		await Promise.all(productIds.map((id) => throttledFetch(id, start, end)))
	).flat();

	return keyByProductId(data);
};

export const useCandles = (productIds: string[]) => {
	const [timespan] = useChartTimespan();
	const granularity = CHART_TIMESPAN_GRANULARITIES[timespan];
	const start = getTimeAgo(timespan);
	const end = toUnixTimestamp(new Date());

	const query = useQuery({
		queryKey: ['candles', productIds],
		queryFn: () => getCandlesForProducts(productIds, granularity, start, end),
		staleTime: 1000 * 60,
		refetchInterval: getMsToNextMinuteStart,
	});

	useEffect(() => {
		if (granularity) query.refetch();
	}, [granularity, query.refetch]);

	return query;
};

const getHistoricPerformanceForProducts = async (productIds: string[]) => {
	const granularity = CandleGranularity.ONE_MINUTE;
	const ONE_DAY = 60 * 60 * 24 * 1;
	const SEVEN_DAYS = 60 * 60 * 24 * 7;
	const THIRTY_DAYS = 60 * 60 * 24 * 30;
	const ONE_YEAR = 60 * 60 * 24 * 365;

	// if there are no candles exactly 30 days ago, look for anything in the next hour
	const WINDOW = 60 * 60;

	const days1Start = toUnixTimestamp(subSeconds(new Date(), ONE_DAY));
	const days1End = toUnixTimestamp(subSeconds(new Date(), ONE_DAY - WINDOW));

	const day1Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days1Start,
		days1End,
	);

	const days7Start = toUnixTimestamp(subSeconds(new Date(), SEVEN_DAYS));
	const days7End = toUnixTimestamp(subSeconds(new Date(), SEVEN_DAYS - WINDOW));

	const day7Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days7Start,
		days7End,
	);

	const days30Start = toUnixTimestamp(subSeconds(new Date(), THIRTY_DAYS));
	const days30End = toUnixTimestamp(subSeconds(new Date(), THIRTY_DAYS - WINDOW));

	const day30Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days30Start,
		days30End,
	);

	const days365Start = toUnixTimestamp(subSeconds(new Date(), ONE_YEAR));
	const days365End = toUnixTimestamp(subSeconds(new Date(), ONE_YEAR - WINDOW));

	const day365Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days365Start,
		days365End,
	);

	console.log({
		days1Start,
		days1End,
		d1S: new Date(days1Start * 1000),
		d1E: new Date(days1End * 1000),
		days7Start,
		days7End,
		d7S: new Date(days7Start * 1000),
		d7E: new Date(days7End * 1000),
		days30Start,
		days30End,
		d30S: new Date(days30Start * 1000),
		d30E: new Date(days30End * 1000),
		days365Start,
		days365End,
		d365S: new Date(days365Start * 1000),
		d365E: new Date(days365End * 1000),
	});

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
