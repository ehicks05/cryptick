import { SOCKET_STATUSES } from 'constants/index';
import React from 'react';
import { FaBars, FaHome, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useStore from '../store';

const Header = () => {
	const isShowSettings = useStore((state) => state.isShowSettings);
	const setIsShowSettings = useStore((state) => state.setIsShowSettings);
	const websocketReadyState = useStore((state) => state.websocketReadyState);
	const socketStatus = SOCKET_STATUSES[websocketReadyState];

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
			<div role="button" onClick={() => setIsShowSettings(!isShowSettings)}>
				{isShowSettings ? <FaTimes /> : <FaBars />}
			</div>
		</header>
	);
};

export default React.memo(Header);
