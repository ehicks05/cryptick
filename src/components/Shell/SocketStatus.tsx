import { useCoinbaseWebsocket } from 'api/useCoinbaseWebsocket';

export interface SocketStatus {
	name: string;
	class: { text: string; bg: string };
}

const SOCKET_STATUSES: Record<string, SocketStatus> = {
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
	const { readyState } = useCoinbaseWebsocket();
	const socketStatus = SOCKET_STATUSES[readyState];

	return (
		<div title={socketStatus.name} className="flex items-center justify-center">
			<div className="flex items-center justify-center h-4 w-4">
				<div className={`rounded-full h-2 w-2 ${socketStatus.class.bg}`} />
			</div>
		</div>
	);
};