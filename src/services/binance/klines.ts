import type { SpotRestAPI } from '@binance/spot';
import { CandleGranularity } from 'services/cbp/types/product';
import { keyByProductId } from 'services/utils';
import type { CryptickCandle } from 'types';
import { client } from './client';
import { throttle } from './throttle';

const secondsToBinanceInterval = {
	[CandleGranularity.ONE_MINUTE]: '1m',
	[CandleGranularity.FIVE_MINUTES]: '5m',
	[CandleGranularity.FIFTEEN_MINUTES]: '15m',
	[CandleGranularity.ONE_HOUR]: '1h',
	[CandleGranularity.SIX_HOURS]: '6h',
	[CandleGranularity.ONE_DAY]: '1d',
};

const toCryptickCandle = (
	candle: SpotRestAPI.KlinesItem,
	productId: string,
): CryptickCandle => ({
	productId: `binance:${productId}`,
	timestamp: Number(candle[0]),
	open: Number(candle[1]),
	high: Number(candle[2]),
	low: Number(candle[3]),
	close: Number(candle[4]),
	volume: Number(candle[5]),
	// closeTime: Number(candle[6]),
});

interface Params {
	symbol: string;
	interval: CandleGranularity;
	startTime?: number;
	endTime?: number;
}

const _klines = async ({ symbol, interval, startTime, endTime }: Params) => {
	const response = await client({
		path: '/klines',
		params: new URLSearchParams({
			symbol,
			interval: secondsToBinanceInterval[interval],
			startTime: startTime ? String(startTime * 1000) : '',
			endTime: endTime ? String(endTime * 1000) : '',
		}).toString(),
	});
	const data: SpotRestAPI.KlinesResponse = await response.json();
	return data.map((item) => toCryptickCandle(item, symbol)).toReversed();
};

export const klines = throttle(_klines);

interface ParamsMulti extends Omit<Params, 'symbol'> {
	symbols: string[];
}

export const getKlinesForProducts = async (_params: ParamsMulti) => {
	const { symbols, ...params } = _params;
	const toPromise = async (symbol: string) => {
		const result = await klines({ symbol, ...params });
		return { productId: `binance:${symbol}`, candles: result };
	};
	const data = await Promise.all(symbols.map(toPromise));

	return keyByProductId(data.flat());
};
