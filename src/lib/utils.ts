import type { Candle } from 'api/types/product';
import { type ClassValue, clsx } from 'clsx';
import { sum } from 'es-toolkit';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getChange = (open: number, close: number) => {
	const percentChange = close ? close / open - 1 : 0;
	return {
		direction: percentChange === 0 ? 'UNK' : percentChange > 0 ? 'POS' : 'NEG',
		percentChange,
	} as const;
};

/**
 * Combine any number of candles into an unstoppable super candle
 */
export const mergeCandles = (candles: Candle[]) => {
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
