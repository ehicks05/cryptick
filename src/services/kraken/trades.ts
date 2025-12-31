import { keyByProductId } from 'services/utils';
import type { CryptickCandle } from 'types';
import { client } from './client';
import { throttle } from './throttle';
import type { Trade, TradesResponse } from './types';

const toCryptickCandle = (candle: Trade, productId: string): CryptickCandle => ({
	productId: `kraken:${productId}`,
	timestamp: Number(candle[2]),
	open: Number(candle[0]),
	high: Number(candle[0]),
	low: Number(candle[0]),
	close: Number(candle[0]),
	volume: Number(candle[1]),
});

interface Params {
	pair: string;
	since?: number;
	count: number;
}

const _trades = async ({ pair, since, count }: Params) => {
	const response = await client({
		path: '/Trades',
		params: new URLSearchParams({
			pair,
			since: since ? String(since) : '',
			count: count ? String(count) : '',
		}).toString(),
	});
	const { result }: TradesResponse = await response.json();
	const items = result[pair];
	return items.map((item) => toCryptickCandle(item, pair)).toReversed();
};

export const trades = throttle(_trades);

interface ParamsMulti extends Omit<Params, 'pair'> {
	pairs: string[];
}

export const getTradesForProducts = async (_params: ParamsMulti) => {
	const { pairs, ...params } = _params;
	const toPromise = async (pair: string) => {
		const result = await trades({ pair, ...params });
		return { productId: `kraken:${pair}`, candles: result };
	};
	const data = await Promise.all(pairs.map(toPromise));

	return keyByProductId(data.flat());
};
