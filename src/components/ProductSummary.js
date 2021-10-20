import React from "react";
import { formatPercent, formatPrice } from "utils";

const ProductSummary = ({
  product,
  productPrice,
  dailyStats,
  currency,
  granularityPicker,
}) => {
  return (
    <>
      <ProductName currency={currency} product={product} />
      <ProductPrice
        product={product}
        price={productPrice?.price}
        dailyStats={dailyStats}
      />
      <SecondaryStats
        product={product}
        dailyStats={dailyStats}
        granularityPicker={granularityPicker}
      />
    </>
  );
};

const ProductName = ({ currency, product }) => {
  return (
    <div className="text-gray-700 dark:text-gray-400">
      <span className="text-xl">{currency.name}</span>{" "}
      <span className="text-xs">{product.display_name}</span>
    </div>
  );
};

const ProductPrice = ({ product, price, dailyStats }) => {
  const { isPositive, percent } = dailyStats;
  const color = isPositive ? "text-green-500" : "text-red-500";
  return (
    <>
      <span className="text-3xl font-semibold" id={`${product.id}Price`}>
        {price}
      </span>
      <span className={`ml-2 whitespace-nowrap ${color}`}>
        {formatPercent(percent)}
      </span>
    </>
  );
};

const SecondaryStats = ({ product, dailyStats, granularityPicker }) => {
  const { minimumQuoteDigits } = product;
  const { low, high, volume } = dailyStats;
  return (
    <div className="mb-4 text-xs">
      <div>
        <span>l: {formatPrice(low, minimumQuoteDigits)}</span>
        <span className="ml-4">h: {formatPrice(high, minimumQuoteDigits)}</span>
      </div>
      <div>
        <span>v: {formatPrice(Math.round(volume))}</span>
        {granularityPicker && <span className="ml-4">{granularityPicker}</span>}
      </div>
    </div>
  );
};

export default ProductSummary;
