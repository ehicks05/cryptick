import React from "react";

const Header = ({ title, titleClass, showSettings, setShowSettings }) => {
  return (
    <header>
      <div className="flex p-4 items-center justify-between">
        <div className="justify-start">
          <div title={title} className={`rounded-full h-4 w-4 ${titleClass}`} />
        </div>
        <div className="justify-end">
          <div
            className="cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          >
            {`settings[${showSettings ? "-" : "+"}]`}
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
