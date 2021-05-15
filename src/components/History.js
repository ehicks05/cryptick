import React from "react";

const barWidth = (tradeSize) => {
  return Math.max(Math.floor(Math.log2(tradeSize) + 8), 1);
};

const SIDES = {
  buy: {
    highlight: "green-bold",
    borderColor: "border-green-500",
    textColor: "text-green-500",
  },
  sell: {
    highlight: "red-bold",
    borderColor: "border-red-500",
    textColor: "text-red-500",
  },
};

const History = ({ messages }) => {
  return (
    <div className="overflow-y-hidden">
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
          {messages.map(({ sequence, time, side, price, last_size }) => {
            const style = { borderLeftWidth: barWidth(last_size) };
            return (
              <TR key={sequence} className={SIDES[side].highlight}>
                <TD
                  className={`pl-4 ${SIDES[side].borderColor} `}
                  style={style}
                ></TD>
                <TD>{last_size}</TD>
                <TD className={SIDES[side].textColor}>{price}</TD>
                <TD className="opacity-50">{time}</TD>
              </TR>
            );
          })}
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
