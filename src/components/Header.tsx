import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'wouter';
import { APP_NAME } from '../constants';
import useStore from '../store';

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

const Header = () => {
	const isShowSettings = useStore((state) => state.isShowSettings);
	const setIsShowSettings = useStore((state) => state.setIsShowSettings);

	return (
		<header className="flex p-4 justify-between text-neutral-600 dark:text-neutral-400">
			<Logo />
			<button
				type="button"
				aria-label="settings"
				onClick={() => setIsShowSettings(!isShowSettings)}
			>
				{isShowSettings ? <FaTimes /> : <FaBars />}
			</button>
		</header>
	);
};

export default Header;
