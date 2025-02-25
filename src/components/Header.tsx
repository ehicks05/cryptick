import { Link } from 'wouter';
import { APP_NAME } from '../constants';
import { SettingsDialog } from './Settings';

const Logo = () => {
	return (
		<Link to="/" title="Home" className={'font-logo text-xl'}>
			<div className="flex items-center gap-3">
				<div className="px-2 py-[3.5px] rounded bg-neutral-600 text-neutral-200">
					ct
				</div>
				<div className="hidden sm:block">{APP_NAME}</div>
			</div>
		</Link>
	);
};

const Header = () => (
	<header className="flex p-4 justify-between text-neutral-600 dark:text-neutral-400">
		<Logo />
		<SettingsDialog />
	</header>
);

export default Header;
