import { useQuery } from '@tanstack/react-query';
import { useCandleGranularity } from 'hooks/useCandleGranularity';
import pThrottle from 'p-throttle';
import { useEffect } from 'react';
import { PRODUCT_URL } from './constants';
import { type Candle, CandleGranularity, type RawCandle } from './types/product';
import { getMsToNextMinuteStart } from './utils';

interface Params {
	productId: string;
	granularity: CandleGranularity;
	start?: string;
	end?: string;
	limit?: number;
}

const getCandlesForProduct = async ({
	productId,
	granularity,
	start,
	end,
	limit,
}: Params): Promise<Candle[]> => {
	const url = `${PRODUCT_URL}/${productId}/candles`;
	const query = new URLSearchParams({
		granularity: String(granularity),
		start: start || '',
		...(end && { end }),
		...(limit && { limit: String(limit) }),
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

const subSeconds = (date: Date, n: number) =>
	new Date(date.setSeconds(date.getSeconds() - n));

const keyByProductId = (data: { productId: string; candles: Candle[] }[]) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr.candles;
			return agg;
		},
		{} as Record<string, Candle[]>,
	);

const CANDLE_COUNT = 96;

const getCandlesForProducts = async (
	productIds: string[],
	granularity: CandleGranularity,
	_start?: string,
	_end?: string,
) => {
	const throttledFetch = throttle(
		async (productId: string, start: string, end?: string) => {
			const candles = await getCandlesForProduct({
				productId,
				granularity,
				start,
				end,
			});
			return { productId, candles };
		},
	);

	const start =
		_start || subSeconds(new Date(), granularity * CANDLE_COUNT).toISOString();
	const end = _end || undefined;
	const data = (
		await Promise.all(productIds.map((id) => throttledFetch(id, start, end)))
	).flat();

	return keyByProductId(data);
};

export const useCandles = (productIds: string[]) => {
	const [granularity] = useCandleGranularity();

	const query = useQuery({
		queryKey: ['candles', productIds],
		queryFn: () => getCandlesForProducts(productIds, granularity),
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
	const SEVEN_DAYS = 60 * 60 * 24 * 7;
	const THIRTY_DAYS = 60 * 60 * 24 * 30;

	// if there are no candles exactly 30 days ago, look for anything in the next hour
	const WINDOW = 60 * 60;

	const days7Start = subSeconds(new Date(), SEVEN_DAYS).toISOString();
	const days7End = subSeconds(new Date(), SEVEN_DAYS - WINDOW).toISOString();
	const days30Start = subSeconds(new Date(), THIRTY_DAYS).toISOString();
	const days30End = subSeconds(new Date(), THIRTY_DAYS - WINDOW).toISOString();
	const day7Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days7Start,
		days7End,
	);
	const day30Candles = await getCandlesForProducts(
		productIds,
		granularity,
		days30Start,
		days30End,
	);

	return { day7Candles, day30Candles };
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
