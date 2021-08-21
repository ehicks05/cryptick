import React, { useEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import { isEqual, fromUnixTime, startOfDay, format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { clamp } from "utils";

const CandleChart = ({ height: h, candles }) => {
  const [ref, { width }] = useDimensions();
  const [candleWidthMulti, setCandleWidthMulti] = useState(1);

  const [height, setHeight] = useState(0);

  const baseCandleWidth = 6;
  const candleWidth = baseCandleWidth * candleWidthMulti;

  useEffect(() => {
    setHeight(h - 56 - 48);
  }, [h]);

  if (!candles.length) return <div></div>;

  const viewableCandleCount = width / candleWidth;
  const viewableCandles = candles.slice(0, viewableCandleCount);

  const min = Math.min(...viewableCandles.map((candle) => candle[1]));
  const max = Math.max(...viewableCandles.map((candle) => candle[2]));

  const handleWheel = (e) => {
    const newMulti = candleWidthMulti * (e.deltaY < 0 ? 1.05 : 0.95);
    setCandleWidthMulti(clamp(newMulti, 1, 10));
  };

  const getY = (y) => {
    return height - ((y - min) / (max - min)) * height;
  };

  const getX = (x) => {
    // 32 = allow for a right-side gutter for grid markers
    return width - 32 - x;
  };

  const getHorizontalLines = (min, max) => {
    const range = max - min;
    const roughChunkSize = range / 6;

    let divisor = 1;
    let work = range;
    while (work > 100) {
      work /= 10;
      divisor *= 10;
    }
    const chunkSize = Math.round(roughChunkSize / divisor) * divisor;
    console.log(roughChunkSize);
    console.log(chunkSize);

    const minChunk = Math.round(min / divisor) * divisor;
    const lines = [...new Array(7)].map((_, i) => minChunk + i * chunkSize);
    console.log(lines);
    return lines;
  };

  const horizontalLineEls = getHorizontalLines(min, max).map((line) => (
    <>
      <line
        stroke={"rgba(100, 100, 100, .25)"}
        x1={0}
        y1={getY(line)}
        x2={width}
        y2={getY(line)}
      />
      <text
        fontSize="11"
        fill="rgba(255, 255, 255, .95)"
        x={width - 32}
        y={getY(line) + 3}
      >
        {line}
      </text>
    </>
  ));

  // this controls the gap between candles, decreasing relative gap as you zoom in
  // avoids candles looking too far apart when zoomed in,
  // and too squeezed together when zoomed out
  const rectXDivisor =
    candleWidth < 6 ? 8 : candleWidth < 12 ? 6 : candleWidth < 24 ? 4 : 3;

  const candleEls = viewableCandles.map(
    ([datetime, low, high, open, close], i) => {
      if (i === 0) return null;
      const utc = zonedTimeToUtc(fromUnixTime(datetime));
      const isStartOfDay = isEqual(utc, zonedTimeToUtc(startOfDay(utc)));

      return (
        <React.Fragment key={i}>
          {isStartOfDay && (
            <>
              <line
                stroke={"rgba(100, 100, 100, .25)"}
                x1={getX(i * candleWidth) - candleWidth / 2}
                y1={getY(min)}
                x2={getX(i * candleWidth) - candleWidth / 2}
                y2={getY(max)}
              />
              <text
                fontSize="11"
                fill="rgba(255, 255, 255, .95)"
                x={getX(i * candleWidth) - 22} // 22 = push text down below chart
                y={getY(min) + 16}
              >
                {format(utc, "MMM dd")}
              </text>
            </>
          )}
          <line
            stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
            x1={getX(i * candleWidth)}
            y1={getY(low)}
            x2={getX(i * candleWidth)}
            y2={getY(high)}
          />
          <rect
            stroke={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
            fill={close >= open ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
            x={getX(i * candleWidth) - candleWidth / rectXDivisor}
            y={getY(Math.max(open, close))}
            width={candleWidth / (rectXDivisor / 2)}
            height={Math.abs(getY(close) - getY(open))}
          />
        </React.Fragment>
      );
    }
  );

  return (
    <div ref={ref} className="flex flex-grow w-full h-full">
      {width && height && (
        <svg
          style={{ touchAction: "manipulation" }}
          viewBox={`0 0 ${width} ${height}`}
          onWheel={handleWheel}
        >
          {horizontalLineEls}
          {candleEls}
        </svg>
      )}
    </div>
  );
};

export default React.memo(CandleChart);
