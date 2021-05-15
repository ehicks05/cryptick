import React, { useEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import { isEqual, fromUnixTime, startOfDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import { clamp } from "../utils";

const CandleChart = ({ height: h, candles }) => {
  const [ref, { width }] = useDimensions();
  const [candleWidth, setCandleWidth] = useState(width / (candles.length || 1));
  const [candleWidthMulti, setCandleWidthMulti] = useState(1);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const newBaseWidth = width / (candles.length || 1);
    const newWidth = newBaseWidth * candleWidthMulti;
    setCandleWidth(clamp(newWidth, 2, 20));
  }, [width, candleWidthMulti, candles.length]);

  useEffect(() => {
    setHeight(h - 56 - 48);
  }, [h]);

  if (!candles.length) return <div></div>;

  const min = Math.min(...candles.map((candle) => candle[1]));
  const max = Math.max(...candles.map((candle) => candle[2]));

  const handleWheel = (e) => {
    e.preventDefault();
    setCandleWidthMulti((current) => (current * e.deltaY < 0 ? 1.05 : 0.95));
  };

  const getY = (y) => {
    return height - ((y - min) / (max - min)) * height;
  };

  const candleEls = candles.map(([datetime, low, high, open, close], i) => {
    if (i === 0) return null;
    const utc = zonedTimeToUtc(fromUnixTime(datetime));
    const isStartOfDay = isEqual(utc, zonedTimeToUtc(startOfDay(utc)));

    return (
      <React.Fragment key={i}>
        {isStartOfDay && (
          <line
            stroke={"rgb(100, 100, 100)"}
            x1={i * candleWidth - candleWidth / 2}
            y1={getY(min)}
            x2={i * candleWidth - candleWidth / 2}
            y2={getY(max)}
          />
        )}
        <line
          stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          x1={i * candleWidth}
          y1={getY(low)}
          x2={i * candleWidth}
          y2={getY(high)}
        />
        <rect
          stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          fill={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
          x={i * candleWidth - candleWidth / 4}
          y={getY(Math.max(open, close))}
          width={candleWidth / 2}
          height={Math.abs(getY(close) - getY(open))}
        />
      </React.Fragment>
    );
  });

  return (
    <div ref={ref} className="flex flex-grow w-full h-full">
      {width && height && (
        <svg
          style={{ touchAction: "manipulation" }}
          viewBox={`0 0 ${width} ${height}`}
          // onWheel={handleWheel}
        >
          {candleEls}
        </svg>
      )}
    </div>
  );
};

export default React.memo(CandleChart);
