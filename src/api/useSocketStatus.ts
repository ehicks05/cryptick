import { useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { SOCKET_STATUSES, WS_URL } from './constants';

export const useSocketStatus = () => {
	const { readyState } = useWebSocket(
		WS_URL,
		{
			share: true,
			filter: () => false,
		},
		true,
	);

	return { socketStatus: useMemo(() => SOCKET_STATUSES[readyState], [readyState]) };
};
