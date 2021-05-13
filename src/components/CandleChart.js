import React from "react";
import useDimensions from "react-use-dimensions";

const CandleChart = ({ candles }) => {
  const [ref, { width, height }] = useDimensions();
  if (!candles.length) return <div></div>;

  const candleWidth = width / candles.length;

  const min = Math.min(...candles.map((candle) => candle[1]));
  const max = Math.max(...candles.map((candle) => candle[2]));

  const getY = (y) => {
    return height - ((y - min) / (max - min)) * height;
  };

  const candleEls = candles.map(([_, low, high, open, close], i) => {
    return (
      <>
        <line
          key={`line${i}`}
          stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          x1={i * candleWidth}
          y1={getY(low)}
          x2={i * candleWidth}
          y2={getY(high)}
        />
        <rect
          key={`rect${i}`}
          stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          fill={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          x={i * candleWidth - candleWidth / 4}
          y={getY(Math.max(open, close))}
          width={candleWidth / 2}
          height={Math.abs(getY(close) - getY(open))}
        />
      </>
    );
  });

  return (
    <div ref={ref} className="w-full h-full">
      {width && height && (
        <svg viewBox={`0 0 ${width} ${height}`}>{candleEls}</svg>
      )}
    </div>
  );
};

export default React.memo(CandleChart);
