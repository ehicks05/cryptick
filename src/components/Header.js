import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = ({ title, titleClass, showSettings, setShowSettings }) => {
  return (
    <header className="flex p-4 items-center justify-between">
      <div className="justify-start">
        <div title={title} className={`rounded-full h-4 w-4 ${titleClass}`} />
      </div>
      <div className="justify-end">
        <div
          className="cursor-pointer"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
