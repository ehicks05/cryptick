import { useQuery } from '@tanstack/react-query';
import { useCandleGranularity } from 'hooks/useCandleGranularity';
import pThrottle from 'p-throttle';
import { useEffect } from 'react';
import { PRODUCT_URL } from './constants';
import type { Candle, CandleGranularity, RawCandle } from './types/product';
import { getMsToNextMinuteStart } from './utils';

interface Params {
	productId: string;
	granularity: CandleGranularity;
	start?: string;
	end?: string;
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
		start: start || '',
		...(end && { end }),
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
) => {
	const throttledFetch = throttle(async (productId: string) => {
		const start = subSeconds(new Date(), granularity * CANDLE_COUNT).toISOString();
		const candles = await getCandlesForProduct({ productId, granularity, start });
		return { productId, candles };
	});

	const data = (await Promise.all(productIds.map(throttledFetch))).flat();

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
