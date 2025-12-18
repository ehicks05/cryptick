import { removeExchange } from 'services/utils';

type Method = 'SUBSCRIBE' | 'UNSUBSCRIBE';

export const buildBinanceMessage = (isAdding: boolean, productIds: string[]) => {
	const params = productIds
		.filter((o) => o.startsWith('binance'))
		.map(removeExchange)
		.map((o) => o.toLocaleLowerCase())
		.map((o) => `${o}@aggTrade`);

	const method: Method = isAdding ? 'SUBSCRIBE' : 'UNSUBSCRIBE';

	return JSON.stringify({ method, params, id: 0 });
};
