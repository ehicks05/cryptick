import React from 'react';
import { ReactNode } from 'react';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import useStore from 'store';

const repoUrl = 'https://www.github.com/ehicks05/crypto-price-ticker/';
const siteUrl = 'https://ehicks.net';

const DndLock = () => {
	const isDnd = useStore((state) => state.isReorderEnabled);
	const setIsDnd = useStore((state) => state.setIsReorderEnabled);

	const Icon = isDnd ? FaCheckSquare : FaSquare;
	return (
		<div
			role="button"
			className="flex items-center gap-2"
			onClick={() => setIsDnd(!isDnd)}
			onKeyUp={() => setIsDnd(!isDnd)}
		>
			<Icon className="text-lg" color="gray" />
			<div>Drag n Drop</div>
		</div>
	);
};

interface LinkProps {
	href: string;
	children?: ReactNode;
}

const Link = ({ href, children }: LinkProps) => {
	return (
		<a
			href={href}
			className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
			target="_blank"
			rel="noreferrer"
		>
			{children}
		</a>
	);
};

const Footer = () => {
	return (
		<footer className="flex items-center justify-between p-2 sm:p-4">
			<DndLock />
			<span className="flex gap-4">
				<Link href={repoUrl}>github</Link>
				<Link href={siteUrl}>ehicks</Link>
			</span>
		</footer>
	);
};

export default React.memo(Footer);
