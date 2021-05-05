import React from "react";

const Chart = ({ candles, color }) => {
  const chartHeight = 96;
  const min = Math.min(
    ...candles.map((candle) => candle[3]),
    ...candles.map((candle) => candle[4])
  );
  const max = Math.max(
    ...candles.map((candle) => candle[3]),
    ...candles.map((candle) => candle[4])
  );

  const getY = (y) => {
    return chartHeight - ((y - min) / (max - min)) * chartHeight;
  };

  return (
    <div>
      <svg className="w-full h-24" viewBox={`0 0 288 ${chartHeight}`}>
        {candles.map((candle, i) => {
          return (
            <line
              stroke={color}
              key={i}
              x1={i}
              y1={getY(candle[3])}
              x2={i + 1}
              y2={getY(candle[4])}
            ></line>
          );
        })}
      </svg>
    </div>
  );
};

export default React.memo(Chart);
