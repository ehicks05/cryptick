import type { Candle } from 'api/types/product';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const aggregateCandleStats = (candles: Candle[]) => {
  const high = Math.max(...candles.map(o => o.high), 0);
  const low = Math.min(...candles.map(o => o.low));
  const open = candles.at(-1)?.open || 0;
  const close = candles[0]?.close || 0;
  const isPositive = close > open;
  const percentChange = close ? close / open - 1 : 0;

  return { open, close, low, high, isPositive, percentChange };
};
