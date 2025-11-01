import type { ReactNode } from 'react';
import { APP } from '../../constants';

interface LinkProps {
	href: string;
	children: ReactNode;
}

const ExternalLink = ({ href, children }: LinkProps) => (
	<a
		href={href}
		className="text-neutral-600 dark:text-neutral-400 hover:underline"
		target="_blank"
		rel="noreferrer"
	>
		{children}
	</a>
);

export const ExternalLinks = () => (
	<div className="flex gap-4">
		<ExternalLink href={APP.REPO_URL}>github</ExternalLink>
		<ExternalLink href={APP.AUTHOR_URL}>ehicks</ExternalLink>
	</div>
);
