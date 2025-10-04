import React from 'react';
import ExternalLinks from './ExternalLinks';
import { SocketStatus } from './SocketStatus';

const Footer = () => {
	return (
		<footer className="flex items-center justify-between p-4 pt-2 gap-4">
			<SocketStatus />

			<ExternalLinks />
		</footer>
	);
};

export default React.memo(Footer);
