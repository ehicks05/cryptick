import type { ReactNode } from 'react';
import React from 'react';
import { Link, useSearch } from 'wouter';
import { APP_AUTHOR_URL, APP_REPO_URL } from '../constants';

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

const ExternalLinks = () => {
	return (
		<div className="flex gap-4">
			{import.meta.env.DEV && <DebugLink />}
			<ExternalLink href={APP_REPO_URL}>github</ExternalLink>
			<ExternalLink href={APP_AUTHOR_URL}>ehicks</ExternalLink>
		</div>
	);
};

export default React.memo(ExternalLinks);
