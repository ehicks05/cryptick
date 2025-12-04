import { range } from 'es-toolkit';
import type { Candle, CandleGranularity, CoinbaseCandle } from '../types/product';
import { PRODUCT_URL } from './constants';
import { throttle } from './throttle';
import { keyByProductId } from './utils';

const rawCandleToCandle = (candle: CoinbaseCandle, productId: string) => ({
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
	start: number;
	end: number;
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
		const json: CoinbaseCandle[] = await response.json();
		return json.map((candle) => rawCandleToCandle(candle, productId));
	} catch (err) {
		console.log(err);
		return [];
	}
};

const throttledFetch = throttle(async (params: Params) => getCandles(params));

const RESPONSE_LIMIT = 300;

// honor RESPONSE_LIMIT by splitting request into batches as needed
const getCandlesForProduct = async ({
	productId,
	granularity,
	start,
	end,
}: Params) => {
	const estimatedCandleCount = Math.ceil((end - start) / granularity);
	const batches = Math.ceil(estimatedCandleCount / RESPONSE_LIMIT);

	const promises = range(batches).map((i) =>
		throttledFetch({
			productId,
			granularity,
			start: start + granularity * RESPONSE_LIMIT * i,
			end: Math.min(start + granularity * RESPONSE_LIMIT * (i + 1), end),
		}),
	);
	const results = await Promise.all(promises);

	return { productId, candles: results.toReversed().flat() };
};

interface ParamsMulti extends Omit<Params, 'productId'> {
	productIds: string[];
}

export const getCandlesForProducts = async (_params: ParamsMulti) => {
	const { productIds, ...params } = _params;
	const toPromise = (productId: string) =>
		getCandlesForProduct({ productId, ...params });
	const data = await Promise.all(productIds.map(toPromise));

	return keyByProductId(data.flat());
};
