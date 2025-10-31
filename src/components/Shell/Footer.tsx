import { SOCKET_STATUSES } from 'api/constants';
import { useCoinbaseWebsocket } from 'api/useCoinbaseWebsocket';
import { ExternalLinks } from './ExternalLinks';

const SocketStatus = () => {
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

export const Footer = () => (
	<footer className="flex items-center justify-between p-4 pt-2 gap-4">
		<SocketStatus />
		<ExternalLinks />
	</footer>
);
