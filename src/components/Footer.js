import React from "react";

const Footer = () => {
  return (
    <>
      <div className="flex-grow"></div>

      <footer>
        <div className="flex flex-col md:flex-row p-4 items-end justify-end">
          <div className="  ">
            <span className="space-x-4">
              <a
                className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
                href="https://www.github.com/ehicks05/bitcoin-price-ticker/"
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>
              <a
                className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
                href="https://ehicks.net"
              >
                ehicks
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default React.memo(Footer);
