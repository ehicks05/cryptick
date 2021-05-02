import React from "react";
import { getPrettyPrice } from "../utils";

const getPercentChange = (from, to) => {
  const delta = to - from;
  const color = delta >= 0 ? "green" : "red";
  const percent = Intl.NumberFormat("en-US", {
    style: "percent",
    signDisplay: "always",
    maximumFractionDigits: 2,
  }).format(delta / from);
  return { percent, color };
};

const ProductSection = ({ product, productPrice, productStats, currency }) => {
  if (!productStats) return "...";
  const change24Hour = getPercentChange(productStats.open, productStats.last);
  return (
    <div className="w-56">
      <div className="text-gray-700 dark:text-gray-400">
        {currency.name} <span className="text-xs">{product.id}</span>
      </div>
      <span className="text-2xl font-semibold" id={`${product.id}Price`}>
        {productPrice?.price}
      </span>
      <span className={`ml-2 text-${change24Hour.color}-500`}>
        {change24Hour.percent}
      </span>
      <div className="text-xs">
        <div>
          <span>l: {productStats.low}</span>
          <span className="ml-4">h: {productStats.high}</span>
        </div>
        <div>v: {getPrettyPrice(productStats.volume)}</div>
      </div>
    </div>
  );
};

export default React.memo(ProductSection);
