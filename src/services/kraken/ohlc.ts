import { CandleGranularity } from 'services/cbp/types/product';
import { keyByProductId } from 'services/utils';
import type { CryptickCandle } from 'types';
import { client } from './client';
import { throttle } from './throttle';
import type { Ohlc, OhlcResponse } from './types';

const secondsToKrakenInterval = {
	[CandleGranularity.ONE_MINUTE]: '1',
	[CandleGranularity.FIVE_MINUTES]: '5',
	[CandleGranularity.FIFTEEN_MINUTES]: '15',
	[CandleGranularity.ONE_HOUR]: '60',
	[CandleGranularity.SIX_HOURS]: '360',
	[CandleGranularity.ONE_DAY]: '1440',
};

const toCryptickCandle = (candle: Ohlc, productId: string): CryptickCandle => ({
	productId: `kraken:${productId}`,
	timestamp: Number(candle[0]),
	open: Number(candle[1]),
	high: Number(candle[2]),
	low: Number(candle[3]),
	close: Number(candle[4]),
	volume: Number(candle[6]),
});

interface Params {
	pair: string;
	interval: CandleGranularity;
	since?: number;
}

const _ohlc = async ({ pair, interval, since }: Params) => {
	const response = await client({
		path: '/OHLC',
		params: new URLSearchParams({
			pair,
			interval: secondsToKrakenInterval[interval],
			since: since ? String(since * 1000) : '',
		}).toString(),
	});
	const { result }: OhlcResponse = await response.json();
	const items = result[pair];
	return items.map((item) => toCryptickCandle(item, pair)).toReversed();
};

export const ohlc = throttle(_ohlc);

interface ParamsMulti extends Omit<Params, 'pair'> {
	pairs: string[];
}

export const getOhlcsForProducts = async (_params: ParamsMulti) => {
	const { pairs, ...params } = _params;
	const toPromise = async (pair: string) => {
		const result = await ohlc({ pair, ...params });
		return { productId: `kraken:${pair}`, candles: result };
	};
	const data = await Promise.all(pairs.map(toPromise));

	return keyByProductId(data.flat());
};
