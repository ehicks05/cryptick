import React from "react";

const candleWidth = 1;

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

  const points = candles
    .map(
      (candle, i) =>
        `${i * candleWidth},${getY(candle[3])} ${
          i * candleWidth + (candleWidth - 1)
        },${getY(candle[4])}`
    )
    .join(" ");

  return (
    <div>
      <svg className="w-full h-24" viewBox={`0 0 288 ${chartHeight}`}>
        <polyline fill={"none"} stroke={color} points={points} />
      </svg>
    </div>
  );
};

export default React.memo(Chart);
