import { useMeasure } from "@uidotdev/usehooks";
import { use24HourStats, useCandles } from "api";
import { useState } from "react";
import { STROKE } from "./constants";
import { round } from "./round";
import { useIdealCandleWidth } from "./useIdealCandleWidth";

export const useChartData = ({ productId, isDebug }: { productId: string, isDebug: boolean }) => {
  const [ref, { height: containerHeight, width: containerWidth }] = useMeasure();
  const { data } = use24HourStats();
  const productStats = data?.[productId];

  const isPositive = productStats ? productStats.isPositive : undefined;
  const colorKey = isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';
  const strokeColor = STROKE[colorKey]

  const candlesQuery = useCandles([productId]);
  const _candles = candlesQuery.data?.[productId] || [];

  const [idealCandleWidth, setIdealCandleWidth] = useState(3.7);
  const { debug, idealCandles } = useIdealCandleWidth(
    _candles,
    containerWidth || 0,
    idealCandleWidth,
  );

  const candles = isDebug ? idealCandles : _candles.slice(0, 96);

  const step = (candles[0]?.timestamp || 0) - (candles[1]?.timestamp || 0);
  const start = candles[candles.length - 1]?.timestamp || 0;
  const end = (candles[0]?.timestamp || 0) + step;

  const height = containerHeight || 0;
  const width = containerWidth || 0;

  const min = Math.min(...candles.map((c) => c.close));
  const max = Math.max(...candles.map((c) => c.close));

  const getX = (timestamp: number) => {
    const range = end - start;
    const delta = timestamp - start;
    const fraction = (delta / range) * width;
    return round(fraction, 4);
  };

  const getY = (y: number) => {
    const range = max - min;
    const delta = y - min;
    const fraction = height - (delta / range) * height;
    return round(fraction, 4);
  };

  const points =
    candles.length !== 0
      ? [
        // manually insert a point for the closing price of the latest candle
        `${getX(candles[0].timestamp + step)}, ${getY(candles[0].close)}`,
        // use every candle's opening price
        ...candles.map(
          (candle) => `${getX(candle.timestamp)}, ${getY(candle.open)}`,
        ),
      ]
      : [];

  return {
    points: points.join(" "),
    strokeColor,
    debug,
    ref,
    height,
    width,
    idealCandleWidth,
    setIdealCandleWidth,
  };
};