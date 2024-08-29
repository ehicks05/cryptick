import React from 'react';
import type { ReactNode } from 'react';

const repoUrl = 'https://www.github.com/ehicks05/crypto-price-ticker/';
const siteUrl = 'https://ehicks.net';

interface LinkProps {
	href: string;
	children?: ReactNode;
}

const Link = ({ href, children }: LinkProps) => {
	return (
		<a
			href={href}
			className="text-blue-300 hover:underline hover:text-blue-400 visited:text-purple-400"
			target="_blank"
			rel="noreferrer"
		>
			{children}
		</a>
	);
};

const Footer = () => {
	return (
		<footer className="flex justify-end p-2 sm:p-4 gap-4">
			<Link href={repoUrl}>github</Link>
			<Link href={siteUrl}>ehicks</Link>
		</footer>
	);
};

export default React.memo(Footer);
