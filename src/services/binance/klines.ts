import type { SpotRestAPI } from '@binance/spot';
import { client } from './client';
import { throttle } from './throttle';

const rawCandleToCandle = (candle: SpotRestAPI.KlinesItem, productId: string) => ({
	productId,
	timestamp: candle[0],
	open: Number(candle[1]),
	high: Number(candle[2]),
	low: Number(candle[3]),
	close: Number(candle[4]),
	volume: Number(candle[5]),
	closeTime: candle[6],
});

const _klines = async (params: SpotRestAPI.KlinesRequest) => {
	const response = await client.restAPI.klines(params);
	const data = await response.data();
	return data.map((item) => rawCandleToCandle(item, params.symbol));
};

export const klines = throttle(_klines);
