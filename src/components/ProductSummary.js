import React, {useCallback, useRef, useEffect, useState} from "react";
import { useThrottle, useInterval } from "react-use";
import { formatPercent, formatPrice } from "utils";
import useStore from '../store';

const ProductSummary = ({
  productId,
  dailyStats,
  granularityPicker,
}) => {
  const product = useStore(useCallback(state => state.products[productId], [productId]))
  const currency = useStore(useCallback(state => state.currencies[product.base_currency], [product]))

  return (
    <>
      <ProductName currency={currency} product={product} />
      <ProductPrice
        productId={productId}
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

const ProductPrice = ({ productId, dailyStats }) => {
  // Fetch initial state
  const priceRef = useRef(useStore.getState().prices[productId]?.price);
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => useStore.subscribe(
    state => state.prices[productId]?.price,
    price => (priceRef.current = price),
  ), [productId]);

  const [price, setPrice] = useState(priceRef.current);

  useInterval(
    () => {
      setPrice(priceRef.current);
    },
    2000
  );

  const { isPositive, percent } = dailyStats;
  const color = isPositive ? "text-green-500" : "text-red-500";
  return (
    <>
      <span className="text-3xl font-semibold" id={`${productId}Price`}>
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
