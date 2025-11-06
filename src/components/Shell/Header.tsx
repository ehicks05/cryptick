import { ThemeToggle } from 'components/Theme/ThemeToggle';
import { Link } from 'wouter';
import { APP } from '../../constants';
import { SettingsDialog } from '../Settings/Settings';
import { SocketStatus } from './SocketStatus';

const Logo = () => {
	return (
		<Link to="/" title="Home" className={'font-logo text-xl'}>
			<div className="flex items-center gap-3">
				<div className="px-2 py-[3.5px] rounded-sm bg-neutral-500 text-white dark:bg-neutral-600 dark:text-neutral-200">
					ct
				</div>
				<div className="hidden sm:block">{APP.NAME}</div>
			</div>
		</Link>
	);
};

export const Header = () => (
	<header className="flex p-4 justify-between text-neutral-600 dark:text-neutral-400">
		<Logo />

		<div className="flex gap-2">
			<SocketStatus />
			<ThemeToggle />
			<SettingsDialog />
		</div>
	</header>
);
