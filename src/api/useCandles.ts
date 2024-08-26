import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import pThrottle from 'p-throttle';
import { PRODUCT_URL } from './constants';
import {
	CandleGranularity,
	type DailyCandles,
	type RawCandle,
} from './types/product';

interface Params {
	productId: string;
	granularity: CandleGranularity;
	start?: string;
	end?: string;
}

export const getCandlesForProduct = async ({
	productId,
	granularity,
	start,
	end,
}: Params): Promise<RawCandle[]> => {
	try {
		const url = `${PRODUCT_URL}/${productId}/candles`;

		const query = new URLSearchParams({
			granularity: String(granularity),
			start: start || '',
			end: end || '',
		});

		const input = `${url}?${query}`;
		return await (await fetch(input)).json();
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

const getDailyCandles = async (productIds: string[]): Promise<DailyCandles> => {
	const throttledFetch = throttle(async (productId: string) => {
		const candles = await getCandlesForProduct({
			productId,
			granularity: CandleGranularity.FIFTEEN_MINUTES,
			start: subDays(new Date(), 1).toISOString(),
			end: new Date().toISOString(),
		});
		return { productId, candles };
	});

	const data = (await Promise.all(productIds.map(throttledFetch))).flat();
	return _.keyBy(data, 'productId');
};

export const useCandles = (productIds: string[]) => {
	return useQuery({
		queryKey: ['candles', productIds],
		queryFn: () => getDailyCandles(productIds),
		staleTime: 1000 * 60,
		refetchInterval: 1000 * 60,
	});
};
