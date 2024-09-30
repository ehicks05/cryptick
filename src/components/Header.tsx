import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'wouter';
import { useTitle } from '../hooks';
import useStore from '../store';

const Header = () => {
	useTitle();
	const [isShowSettings, setIsShowSettings] = useStore((state) => [
		state.isShowSettings,
		state.setIsShowSettings,
	]);

	return (
		<header className="flex p-4 justify-between text-neutral-600 dark:text-neutral-400">
			<div className="flex gap-2 items-center">
				<Link to="/" title="Home" className={'font-logo text-xl'}>
					<div className="flex items-center gap-3">
						<div className="px-2 py-[3.5px] rounded bg-neutral-600 text-neutral-200">
							ct
						</div>
						<div className="hidden sm:block">crypto ticker</div>
					</div>
				</Link>
			</div>
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
