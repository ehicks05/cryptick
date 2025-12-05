import type { SpotRestAPI } from '@binance/spot';
import { client } from './client';
import { throttle } from './throttle';

const toCryptickCandle = (candle: SpotRestAPI.KlinesItem, productId: string) => ({
	productId,
	timestamp: candle[0],
	open: Number(candle[1]),
	high: Number(candle[2]),
	low: Number(candle[3]),
	close: Number(candle[4]),
	volume: Number(candle[5]),
	closeTime: candle[6],
});

interface Params {
	symbol: string;
	interval: string;
}

const _klines = async (params: Params) => {
	const response = await client({
		path: '/klines',
		params: new URLSearchParams({ ...params }).toString(),
	});
	const data: SpotRestAPI.KlinesResponse = await response.json();
	return data.map((item) => toCryptickCandle(item, params.symbol));
};

export const klines = throttle(_klines);
