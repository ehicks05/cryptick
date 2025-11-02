import pThrottle from 'p-throttle';
import { PRODUCT_URL } from '../constants';
import type { Candle, CandleGranularity, RawCandle } from '../types/product';
import { keyByProductId } from '../utils';

const rawCandleToCandle = (candle: RawCandle, productId: string) => ({
	productId,
	timestamp: candle[0] * 1000,
	low: candle[1],
	high: candle[2],
	open: candle[3],
	close: candle[4],
	volume: candle[5],
});

interface Params {
	productId: string;
	granularity: CandleGranularity;
	start?: number;
	end?: number;
}

const getCandles = async ({
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
		return json.map((candle) => rawCandleToCandle(candle, productId));
	} catch (err) {
		console.log(err);
		return [];
	}
};

const throttle = pThrottle({
	limit: 10,
	interval: 1000,
});

const throttledFetch = throttle(async (params: Params) => {
	const candles = await getCandles(params);
	return { productId: params.productId, candles };
});

interface ParamsMulti extends Omit<Params, 'productId'> {
	productIds: string[];
}

export const getCandlesForProducts = async (_params: ParamsMulti) => {
	const { productIds, ...params } = _params;
	const toPromise = (productId: string) => throttledFetch({ productId, ...params });
	const data = await Promise.all(productIds.map(toPromise));

	return keyByProductId(data.flat());
};
