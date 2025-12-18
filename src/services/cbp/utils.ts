import { removeExchange } from 'services/utils';

type MessageType = 'subscribe' | 'unsubscribe';

export const buildCoinbaseMessage = (isAdding: boolean, productIds: string[]) => {
	const type: MessageType = isAdding ? 'subscribe' : 'unsubscribe';

	const product_ids = productIds
		.filter((o) => o.startsWith('coinbase'))
		.map(removeExchange);

	return JSON.stringify({
		type,
		product_ids,
		channels: ['ticker'],
	});
};
