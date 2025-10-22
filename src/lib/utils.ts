import type { Candle } from 'api/types/product';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getChange = (open: number, close: number) => {
	return {
		isPositive: close > open,
		percentChange: close ? close / open - 1 : 0,
	};
};

export const aggregateCandleStats = (candles: Candle[]) => {
	const high = Math.max(...candles.map((o) => o.high), 0);
	const low = Math.min(...candles.map((o) => o.low));
	const open = candles.at(-1)?.open || 0;
	const close = candles[0]?.close || 0;
	const { isPositive, percentChange } = getChange(open, close);

	return { open, close, low, high, isPositive, percentChange };
};
