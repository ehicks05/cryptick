import { useProductIds } from 'hooks/useStorage';
import { ReadyState } from 'react-use-websocket';
import { useBinanceWebsocket } from 'services/binance/useBinanceWebsocket';
import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';
import { useKrakenWebsocket } from 'services/kraken/useKrakenWebsocket';
import type { Exchange } from 'types';

export interface SocketStatus {
	code: number;
	name: string;
	class: { bg: string };
}

export const SOCKET_STATUSES: Record<ReadyState, SocketStatus> = {
	'-1': {
		code: -1,
		name: 'Unused',
		class: { bg: 'bg-neutral-500' },
	},
	'0': {
		code: 0,
		name: 'Connecting',
		class: { bg: 'bg-blue-500' },
	},
	'1': {
		code: 1,
		name: 'Connected',
		class: { bg: 'bg-green-500' },
	},
	'2': {
		code: 2,
		name: 'Closing',
		class: { bg: 'bg-yellow-300' },
	},
	'3': {
		code: 3,
		name: 'Closed',
		class: { bg: 'bg-red-500' },
	},
} as const;

export const useSocketStatus = (exchange: Exchange | 'all') => {
	const { readyState: coinbaseStatus } = useCoinbaseWebsocket();
	const { readyState: binanceStatus } = useBinanceWebsocket();
	const { readyState: krakenStatus } = useKrakenWebsocket();
	const { productIds } = useProductIds();

	const isCoinbaseProductSelected = productIds.some((id) => id.includes('coinbase'));
	const isBinanceProductSelected = productIds.some((id) => id.includes('binance'));
	const isKrakenProductSelected = productIds.some((id) => id.includes('kraken'));

	const enabledSockets = [
		...(isCoinbaseProductSelected ? [coinbaseStatus] : []),
		...(isBinanceProductSelected ? [binanceStatus] : []),
		...(isKrakenProductSelected ? [krakenStatus] : []),
	];

	const mergedStatus = enabledSockets.every((s) => s === enabledSockets[0])
		? enabledSockets[0]
		: ReadyState.CONNECTING;

	const _socketStatus =
		exchange === 'all'
			? mergedStatus
			: exchange === 'coinbase'
				? coinbaseStatus
				: exchange === 'binance'
					? binanceStatus
					: exchange === 'kraken'
						? krakenStatus
						: mergedStatus;

	const socketStatus = SOCKET_STATUSES[_socketStatus];

	return {
		socketStatus,
	};
};
