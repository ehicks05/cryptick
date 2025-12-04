import type { CryptickCandle } from 'types';

export const keyById = <T extends { id: string }>(list: T[]) =>
	list.reduce(
		(agg, curr) => {
			agg[curr.id] = curr;
			return agg;
		},
		{} as Record<string, T>,
	);

export const keyByProductId = <
	T extends { productId: string; candles: CryptickCandle[] },
>(
	data: T[],
) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr.candles;
			return agg;
		},
		{} as Record<string, T['candles']>,
	);
