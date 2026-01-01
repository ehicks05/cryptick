import { removeExchange } from 'services/utils';

type Method = 'subscribe' | 'unsubscribe';

export const buildKrakenMessage = (isAdding: boolean, productIds: string[]) => {
	const symbol = productIds
		.filter((o) => o.startsWith('kraken'))
		.map(removeExchange);

	const method: Method = isAdding ? 'subscribe' : 'unsubscribe';

	return JSON.stringify({ method, params: { channel: 'trade', symbol } });
};
