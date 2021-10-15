import React, { useEffect, useState } from "react";
import useDimensions from "react-use-dimensions";
import { isEqual, fromUnixTime, startOfDay, format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { clamp } from "utils";

const CandleChart = ({ height: h, candles, productPrice }) => {
  const [ref, { width }] = useDimensions();
  const [candleWidthMulti, setCandleWidthMulti] = useState(2);
  const [mousePos, setMousePos] = useState(undefined);
  console.log(mousePos);
  const [height, setHeight] = useState(0);

  const baseCandleWidth = 6;
  const candleWidth = baseCandleWidth * candleWidthMulti;

  useEffect(() => {
    setHeight(h - 56 - 48);
  }, [h]);

  if (!candles.length) return <div></div>;

  const viewableCandleCount = width / candleWidth;
  const viewableCandles = candles.slice(0, viewableCandleCount);

  // set current candle's current price
  if (viewableCandles?.[0]?.[4]) {
    const candle = viewableCandles[0];
    const currentPrice = Number(productPrice.price.replace(/,/g, ""));
    candle[4] = currentPrice;
    if (currentPrice < candle[1]) candle[1] = currentPrice;
    if (currentPrice > candle[2]) candle[2] = currentPrice;
  }

  const min = Math.min(...viewableCandles.map((candle) => candle[1]));
  const max = Math.max(...viewableCandles.map((candle) => candle[2]));

  const handleWheel = (e) => {
    const newMulti = candleWidthMulti * (e.deltaY < 0 ? 1.1 : 0.9);
    setCandleWidthMulti(clamp(newMulti, 1, 10));
  };

  const getY = (y) => {
    return height - ((y - min) / (max - min)) * height;
  };

  const getX = (x) => {
    // 32 = allow for a right-side gutter for grid markers
    return width - 36 - x;
  };

  const getHorizontalLines = (min, max) => {
    const range = max - min;
    console.log(`range: ${range}`);
    const targetGridLines = height / 50; // we want a gridline every 50 pixels
    console.log(`targetGridLines: ${targetGridLines}`);

    let power = -4;
    let optionIndex = 0;
    const options = [1, 2.5, 5];

    while (
      range / (options[optionIndex] * Math.pow(10, power)) >
      targetGridLines
    ) {
      if (optionIndex === options.length - 1) {
        optionIndex = 0;
        power += 1;
      } else {
        optionIndex += 1;
      }
    }
    const gridSize = options[optionIndex] * Math.pow(10, power);
    console.log(`gridSize: ${gridSize}`);

    const minChunk = Number(min.toPrecision(2));
    const lines = [...new Array(32)].map(
      (_, i) => minChunk + (i - 3) * gridSize
    );
    console.log(lines);
    return lines;
  };

  const horizontalLineEls = getHorizontalLines(min, max).map((line) => (
    <g className="text-black dark:text-white">
      <line
        stroke={"rgba(100, 100, 100, .25)"}
        x1={0}
        y1={getY(line)}
        x2={width}
        y2={getY(line)}
      />
      <text
        fontSize="11"
        className="fill-current"
        x={width - 36}
        y={getY(line) + 3}
      >
        {line}
      </text>
    </g>
  ));

  // this controls the gap between candles, decreasing relative gap as you zoom in
  // avoids candles looking too far apart when zoomed in,
  // and too squeezed together when zoomed out
  const rectXDivisor =
    candleWidth < 6 ? 8 : candleWidth < 12 ? 6 : candleWidth < 24 ? 4 : 3;

  const candleEls = viewableCandles.map(
    ([datetime, low, high, open, close], _i) => {
      // if (i === 0) return null;
      const i = _i + 1;
      const utc = zonedTimeToUtc(fromUnixTime(datetime));
      const isStartOfDay = isEqual(utc, zonedTimeToUtc(startOfDay(utc)));
      return (
        <React.Fragment key={_i}>
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
                className="fill-current"
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
    <div
      ref={ref}
      className="flex flex-grow w-full h-full"
      // onMouseMove={(e) => {
      //   let rect = e.target.getBoundingClientRect();
      //   let x = e.clientX - rect.left; //x position within the element.
      //   let y = e.clientY - rect.top; //y position within the element.
      //   // console.log({ x, y });
      //   setMousePos({ x, y });
      // }}
      // onMouseOut={() => setMousePos(undefined)}
    >
      {width && height && (
        <svg
          style={{ touchAction: "manipulation" }}
          viewBox={`0 0 ${width} ${height}`}
          onWheel={handleWheel}
        >
          {horizontalLineEls}
          {candleEls}
          {mousePos && (
            <>
              {/* horizontal */}
              <line
                stroke={"rgba(100, 100, 100, .35)"}
                x1={0}
                y1={mousePos.y}
                x2={width}
                y2={mousePos.y}
              />
              {/* vertical */}
              <line
                stroke={"rgba(100, 100, 100, .35)"}
                x1={mousePos.x}
                y1={0}
                x2={mousePos.x}
                y2={h}
              />
            </>
          )}
        </svg>
      )}
    </div>
  );
};

export default React.memo(CandleChart);
