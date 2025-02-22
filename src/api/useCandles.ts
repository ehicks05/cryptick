import { useQuery } from '@tanstack/react-query';
import pThrottle from 'p-throttle';
import { PRODUCT_URL } from './constants';
import { type Candle, CandleGranularity, type RawCandle } from './types/product';

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
		end: end || '',
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

const subDays = (date: Date, n: number) =>
	new Date(date.setDate(date.getDate() - n));

const keyByProductId = (data: { productId: string; candles: Candle[] }[]) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr.candles;
			return agg;
		},
		{} as Record<string, Candle[]>,
	);

const getDailyCandles = async (productIds: string[]) => {
	const throttledFetch = throttle(async (productId: string) => {
		const candles = await getCandlesForProduct({
			productId,
			granularity: CandleGranularity.FIFTEEN_MINUTES,
			start: subDays(new Date(), 2).toISOString(),
			end: new Date().toISOString(),
		});
		return { productId, candles };
	});

	const data = (await Promise.all(productIds.map(throttledFetch))).flat();

	return keyByProductId(data);
};

export const useCandles = (productIds: string[]) =>
	useQuery({
		queryKey: ['candles', productIds],
		queryFn: () => getDailyCandles(productIds),
		staleTime: 1000 * 60,
		refetchInterval: 1000 * 60,
	});
