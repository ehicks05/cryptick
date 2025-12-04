import type { SpotRestAPI } from '@binance/spot';
import { client } from './client';
import { throttle } from './throttle';

const _exchangeInfo = async () => {
	const response = await client({ path: '/api/v3/exchangeInfo' });
	const data: SpotRestAPI.ExchangeInfoResponse = await response.json();
	return {
		...data,
		symbols: data.symbols?.filter((symbol) => symbol.status === 'TRADING'),
	};
};

export const exchangeInfo = throttle(_exchangeInfo);
