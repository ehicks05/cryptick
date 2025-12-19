import { useProductIds } from 'hooks/useStorage';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from './constants';

export const useCoinbaseWebsocket = () => {
	const { productIds } = useProductIds();
	const shouldConnect = productIds.some((id) => id.includes('coinbase'));

	const { sendJsonMessage, readyState } = useWebSocket(
		WS_URL,
		{
			filter: () => false,
			share: true,
		},
		shouldConnect,
	);

	return { sendCoinbaseMessage: sendJsonMessage, readyState };
};
