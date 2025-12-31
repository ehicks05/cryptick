import { type CryptickCandle, EXCHANGES } from 'types';

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

export const removeExchange = (productId: string) =>
	productId
		.replace(`${EXCHANGES.coinbase}:`, '')
		.replace(`${EXCHANGES.binance}:`, '')
		.replace(`${EXCHANGES.kraken}:`, '');
