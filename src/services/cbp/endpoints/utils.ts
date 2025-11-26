import type { Candle } from '../types/product';

export const keyById = <T extends { id: string }>(list: T[]) =>
	list.reduce(
		(agg, curr) => {
			agg[curr.id] = curr;
			return agg;
		},
		{} as Record<string, T>,
	);

export const keyByProductId = <T extends { productId: string; candles: Candle[] }>(
	data: T[],
) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr.candles;
			return agg;
		},
		{} as Record<string, T['candles']>,
	);