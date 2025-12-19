import { useProductIds } from 'hooks/useStorage';
import useWebSocket from 'react-use-websocket';
import { WS_URL } from './constants';

export const useBinanceWebsocket = () => {
	const { productIds } = useProductIds();
	const shouldConnect = productIds.some((id) => id.includes('binance'));

	const { sendJsonMessage, readyState } = useWebSocket(
		WS_URL,
		{
			filter: () => false,
			share: true,
			shouldReconnect: () => true,
		},
		shouldConnect,
	);

	return { sendBinanceMessage: sendJsonMessage, readyState };
};
