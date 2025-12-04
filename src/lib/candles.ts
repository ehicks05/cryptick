import { sum } from 'es-toolkit';
import type { CryptickCandle } from 'types';
import { getChange } from './math';

/**
 * Combine any number of candles into an unstoppable super candle
 */
export const mergeCandles = (candles: CryptickCandle[]) => {
	const high = Math.max(...candles.map((o) => o.high), 0);
	const low = Math.min(...candles.map((o) => o.low));
	const open = candles.at(-1)?.open || 0;
	const close = candles[0]?.close || 0;
	const volume = sum(candles.map((o) => o.volume));
	const { direction, percentChange } = getChange(open, close);

	return {
		productId: candles[0]?.productId,
		timestamp: candles.at(-1)?.timestamp || 0,
		open,
		close,
		low,
		high,
		volume,
		direction,
		percentChange,
	};
};
