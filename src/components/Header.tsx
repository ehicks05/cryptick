import React from 'react';
import { FaBars, FaHome, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useStore from '../store';
import { useTicker } from 'api';

const Header = () => {
	const isShowSettings = useStore((state) => state.isShowSettings);
	const setIsShowSettings = useStore((state) => state.setIsShowSettings);
	const { socketStatus } = useTicker();

	return (
		<header className="flex p-4 justify-between">
			<div className="flex gap-2 items-center">
				<div title={socketStatus.name} className={'flex items-center h-4 w-4'}>
					<div className={`m-auto rounded-full h-2 w-2 ${socketStatus.class}`} />
				</div>
				<Link to={'/'} title="Home">
					<FaHome className={'h-4 w-4 text-blue-400'} />
				</Link>
			</div>
			<button type="button" onClick={() => setIsShowSettings(!isShowSettings)}>
				{isShowSettings ? <FaTimes /> : <FaBars />}
			</button>
		</header>
	);
};

export default Header;
