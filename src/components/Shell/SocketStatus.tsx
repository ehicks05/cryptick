import { useProductIds } from 'hooks/useStorage';
import { cn } from 'lib/utils';
import { ReadyState } from 'react-use-websocket';
import { useBinanceWebsocket } from 'services/binance/useBinanceWebsocket';
import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';

export interface SocketStatus {
	name: string;
	class: { text: string; bg: string };
}

const SOCKET_STATUSES: Record<ReadyState, SocketStatus> = {
	'-1': {
		name: 'Uninstantiated',
		class: { text: 'text-red-500', bg: 'bg-red-500' },
	},
	'0': { name: 'Connecting', class: { text: 'text-blue-500', bg: 'bg-blue-500' } },
	'1': { name: 'Connected', class: { text: 'text-green-500', bg: 'bg-green-500' } },
	'2': { name: 'Closing', class: { text: 'text-yellow-300', bg: 'bg-yellow-300' } },
	'3': { name: 'Closed', class: { text: 'text-red-500', bg: 'bg-red-500' } },
} as const;

export const SocketStatus = () => {
	const { readyState: coinbaseStatus } = useCoinbaseWebsocket();
	const { readyState: binanceStatus } = useBinanceWebsocket();
	const { productIds } = useProductIds();

	const isCoinbaseProductSelected = productIds.some((id) => id.includes('coinbase'));
	const isBinanceProductSelected = productIds.some((id) => id.includes('binance'));

	const enabledSockets = [
		...(isCoinbaseProductSelected ? [coinbaseStatus] : []),
		...(isBinanceProductSelected ? [binanceStatus] : []),
	];

	const mergedStatus = enabledSockets.every((s) => s === enabledSockets[0])
		? enabledSockets[0]
		: ReadyState.CONNECTING;

	const socketStatus = SOCKET_STATUSES[mergedStatus];

	return (
		<div
			title={socketStatus.name}
			className="flex items-center justify-center w-9 h-9 border rounded-md"
		>
			<div className="flex items-center justify-center h-4 w-4">
				<div
					className={cn('rounded-full h-2 w-2', socketStatus.class.bg, {
						'animate-pulse': mergedStatus !== ReadyState.OPEN,
					})}
				/>
			</div>
		</div>
	);
};
