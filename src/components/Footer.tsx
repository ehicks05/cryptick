import React from 'react';
import type { ReactNode } from 'react';
import { Link, useSearch } from 'wouter';
import { SocketStatus } from './SocketStatus';

const repoUrl = 'https://www.github.com/ehicks05/crypto-price-ticker/';
const siteUrl = 'https://ehicks.net';

interface LinkProps {
	href: string;
	children: ReactNode;
}

const ExternalLink = ({ href, children }: LinkProps) => {
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

const DebugLink = () => {
	const search = useSearch();
	const isDebug = search.includes('debug=true');

	return (
		<Link
			className="text-neutral-600 dark:text-neutral-400 hover:underline"
			href={`?debug=${isDebug ? 'false' : 'true'}`}
		>
			debug
		</Link>
	);
};

const Footer = () => {
	return (
		<footer className="flex items-center justify-between p-4 gap-4">
			<SocketStatus />

			<div className="flex gap-4">
				{import.meta.env.DEV && <DebugLink />}
				<ExternalLink href={repoUrl}>github</ExternalLink>
				<ExternalLink href={siteUrl}>ehicks</ExternalLink>
			</div>
		</footer>
	);
};

export default React.memo(Footer);
