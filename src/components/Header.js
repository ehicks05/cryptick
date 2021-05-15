import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = ({ title, titleClass, showSettings, setShowSettings }) => {
  return (
    <header className="flex p-4 justify-between">
      <div title={title} className={`rounded-full h-4 w-4 ${titleClass}`} />
      <div role="button" onClick={() => setShowSettings(!showSettings)}>
        {showSettings ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};

export default React.memo(Header);
