import React from "react";
import { getPrettyPrice } from "../utils";

const getPercentChange = (from, to) => {
  const delta = to - from;
  const positive = delta >= 0;
  const percent = Intl.NumberFormat("en-US", {
    style: "percent",
    signDisplay: "always",
    maximumFractionDigits: 2,
  }).format(delta / from);
  return { percent, positive };
};

const ProductSection = ({
  product,
  productPrice,
  productStats,
  currency,
  candles,
}) => {
  const stats24Hour = productStats.stats_24hour;
  const change24Hour = getPercentChange(stats24Hour.open, stats24Hour.last);
  const gradientStart = change24Hour.positive
    ? "rgba(6, 78, 59, .15)"
    : "rgba(153, 27, 27, .15)";
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to top, ${gradientStart}, rgba(0,0,0,0))`,
      }}
      className={`p-4 w-64 m-2 border rounded  ${
        change24Hour.positive
          ? "border-green-300 dark:border-green-900"
          : "border-red-300 dark:border-red-900"
      }`}
    >
      <div className="text-gray-700 dark:text-gray-400">
        <span className="text-xl">{currency.name}</span>{" "}
        <span className="text-xs">{product.display_name}</span>
      </div>
      <span className="text-3xl font-semibold" id={`${product.id}Price`}>
        {productPrice?.price}
      </span>
      <span
        className={`ml-2 whitespace-nowrap ${
          change24Hour.positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change24Hour.percent}
      </span>
      <div className="text-xs">
        <div>
          <span>l: {getPrettyPrice(stats24Hour.low)}</span>
          <span className="ml-4">h: {getPrettyPrice(stats24Hour.high)}</span>
        </div>
        <div>v: {getPrettyPrice(Math.round(stats24Hour.volume))}</div>
      </div>
      <Chart
        candles={candles}
        color={
          change24Hour.positive ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"
        }
      />
    </div>
  );
};

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
      <svg className="w-full h-24" viewBox={`0 0 300 ${chartHeight}`}>
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

export default React.memo(ProductSection);
