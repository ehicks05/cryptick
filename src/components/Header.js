import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import useStore from '../store';
import { SOCKET_STATUSES} from '../constants';

const Header = () => {
  const isShowSettings = useStore(state => state.isShowSettings);
  const setIsShowSettings = useStore(state => state.setIsShowSettings);
  const websocketReadyState = useStore(state => state.websocketReadyState);
  const socketStatus = SOCKET_STATUSES[websocketReadyState];

  return (
    <header className="flex p-4 justify-between">
      <div title={socketStatus.name} className={`rounded-full h-4 w-4 ${socketStatus.class}`} />
      <div role="button" onClick={() => setIsShowSettings(!isShowSettings)}>
        {isShowSettings ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default React.memo(Header);
