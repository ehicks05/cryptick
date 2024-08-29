import { useTicker } from 'api';
import { useTitle } from 'hooks';
import { FaBars, FaHome, FaTimes } from 'react-icons/fa';
import { Link } from 'wouter';
import useStore from '../store';

const SocketStatus = () => {
	const { socketStatus } = useTicker();

	return (
		<div title={socketStatus.name} className="flex items-center h-4 w-4">
			<div className={`m-auto rounded-full h-2 w-2 ${socketStatus.class}`} />
		</div>
	);
};

const Header = () => {
	useTitle();
	const [isShowSettings, setIsShowSettings] = useStore((state) => [
		state.isShowSettings,
		state.setIsShowSettings,
	]);

	return (
		<header className="flex p-4 justify-between">
			<div className="flex gap-2 items-center">
				<SocketStatus />
				<Link to="/" title="Home">
					<FaHome className="h-4 w-4 text-blue-600 dark:text-blue-300" />
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
