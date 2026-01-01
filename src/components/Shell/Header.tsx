import { AnnouncementsDialog } from 'components/Announcements/Announcements';
import { ThemeToggle } from 'components/Theme/ThemeToggle';
import { Link } from 'wouter';
import { APP } from '../../constants';
import { SettingsDialog } from '../Settings/Settings';
import { DebugDialog } from './Debug';
import { SocketStatusDialog } from './SocketStatusDialog';

const Icon = () => (
	<div className="flex items-center justify-center h-9 w-9 rounded-sm bg-neutral-500 dark:bg-neutral-700">
		<div className="text-white dark:text-neutral-200">ct</div>
	</div>
);

const Logo = () => {
	return (
		<Link to="/" title="Home" className="flex items-center gap-3 font-logo text-xl">
			<Icon />
			<div className="hidden sm:block">{APP.NAME}</div>
		</Link>
	);
};

export const Header = () => (
	<header className="flex p-4 pb-2 justify-between text-neutral-600 dark:text-neutral-400">
		<Logo />

		<div className="flex gap-2">
			<SocketStatusDialog />
			<AnnouncementsDialog />
			<ThemeToggle />
			<SettingsDialog />

			{import.meta.env.DEV && <DebugDialog />}
		</div>
	</header>
);
