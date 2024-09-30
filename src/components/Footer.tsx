import React from 'react';
import type { ReactNode } from 'react';
import { SocketStatus } from './SocketStatus';

const repoUrl = 'https://www.github.com/ehicks05/crypto-price-ticker/';
const siteUrl = 'https://ehicks.net';

interface LinkProps {
	href: string;
	children: ReactNode;
}

const Link = ({ href, children }: LinkProps) => {
	return (
		<a
			href={href}
			className="text-neutral-600 dark:text-neutral-400 hover:underline"
			target="_blank"
			rel="noreferrer"
		>
			{children}
		</a>
	);
};

const Footer = () => {
	return (
		<footer className="flex items-center justify-between p-4 gap-4">
			<SocketStatus />

			<div className="flex gap-4">
				<Link href={repoUrl}>github</Link>
				<Link href={siteUrl}>ehicks</Link>
			</div>
		</footer>
	);
};

export default React.memo(Footer);
