import React from "react";
import useDimensions from "react-use-dimensions";

const Chart = ({ candles, color, className }) => {
  const [ref, { width, height }] = useDimensions();
  if (!candles.length) return <div></div>;

  const candleWidth = width / candles.length;

  const min = Math.min(...candles.map((c) => c[4]));
  const max = Math.max(...candles.map((c) => c[4]));

  const getY = (y) => {
    return height - ((y - min) / (max - min)) * height;
  };

  const getX = (x) => width - x;

  const points = candles
    .map(
      (candle, i) => `${getX(i * candleWidth)}, ${getY(candle[4])}`
    )
    .join(" ");

  return (
    <div className={`${className}`}>
      <div ref={ref} className={`w-full h-full`}>
        {width && height && (
          <svg viewBox={`0 0 ${width} ${height}`}>
            <polyline fill={"none"} stroke={color} strokeLinejoin={'round'} strokeWidth='1.5' points={points} />
          </svg>
        )}
      </div>
    </div>
  );
};

export default React.memo(Chart);
