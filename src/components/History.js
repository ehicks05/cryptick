import React from "react";

const tradeSizeToBars = (tradeSize) => {
  return Math.max(Math.floor(Math.log2(tradeSize) + 8), 1);
};

const History = ({ messages }) => {
  return (
    <div className="h-96 overflow-hidden">
      <table>
        <thead>
          <tr>
            <TD colSpan="4">Trade History</TD>
          </tr>
          <tr>
            <TD></TD>
            <TD>Trade Size</TD>
            <TD>Price</TD>
            <TD>Time</TD>
          </tr>
        </thead>
        <tbody>
          {messages.map(({ sequence, time, side, price, last_size }) => (
            <TR
              key={sequence}
              className={side === "buy" ? "green-bold" : "red-bold"}
            >
              <TD
                className={`pl-4 ${
                  side === "buy" ? "border-green-500" : "border-red-500"
                } `}
                style={{
                  borderLeftWidth: tradeSizeToBars(last_size),
                }}
              ></TD>
              <TD>{last_size}</TD>
              <TD
                className={side === "buy" ? "text-green-500" : "text-red-500"}
              >
                {price}
              </TD>
              <TD className="opacity-50">{time}</TD>
            </TR>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TR = React.memo(({ children, className, ...props }) => {
  return (
    <tr {...props} className={`${className}`}>
      {children}
    </tr>
  );
});

const TD = React.memo(({ children, className, ...props }) => {
  return (
    <td {...props} className={`px-2 ${className}`}>
      {children}
    </td>
  );
});

export default React.memo(History);
