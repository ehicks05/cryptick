import { ExternalLinks } from './ExternalLinks';
import { SocketStatus } from './SocketStatus';

export const Footer = () => (
	<footer className="flex items-center justify-between p-4 pt-2 gap-4">
		<SocketStatus />
		<ExternalLinks />
	</footer>
);
