import useWebSocket from 'react-use-websocket';
import { WS_URL } from './constants';

export const useCoinbaseWebsocket = () => {
	const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
		filter: () => false,
		share: true,
	});

	return { sendJsonMessage, readyState };
};
