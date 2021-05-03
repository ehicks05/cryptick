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

const ProductSection = ({ product, productPrice, productStats, currency }) => {
  const stats24Hour = productStats.stats_24hour;
  const change24Hour = getPercentChange(stats24Hour.open, stats24Hour.last);
  return (
    <div className="p-4 w-64">
      <div className="text-gray-700 dark:text-gray-400">
        <span className="text-xl">{currency.name}</span>{" "}
        <span className="text-xs">{product.id}</span>
      </div>
      <span className="text-3xl font-semibold" id={`${product.id}Price`}>
        {productPrice?.price}
      </span>
      <span
        className={`ml-2 ${
          change24Hour.positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change24Hour.percent}
      </span>
      <div className="text-xs">
        <div>
          <span>l: {stats24Hour.low}</span>
          <span className="ml-4">h: {stats24Hour.high}</span>
        </div>
        <div>v: {getPrettyPrice(stats24Hour.volume)}</div>
      </div>
    </div>
  );
};

export default React.memo(ProductSection);
