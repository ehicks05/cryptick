import { Currency } from "api/currency/types";
import { Product } from "api/product/types";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { useInterval } from "react-use";
import { formatPercent, formatPrice } from "utils";
import useStore, { AppState } from "../store";

// TODO: consider handling this at API level
interface AnnotatedProductStats {
  percent: number;
  isPositive: boolean;
  open: number;
  high: number;
  low: number;
  last: number;
  volume: number;
}

interface ProductSummaryProps {
  productId: string;
  dailyStats: AnnotatedProductStats;
}

const ProductSummary = ({ productId, dailyStats }: ProductSummaryProps) => {
  const product = useStore(
    useCallback((state) => state.products[productId], [productId])
  );
  const currency = useStore(
    useCallback((state) => state.currencies[product.base_currency], [product])
  );

  return (
    <>
      <ProductName currency={currency} product={product} />
      <ProductPrice productId={productId} dailyStats={dailyStats} />
      <SecondaryStats product={product} dailyStats={dailyStats} />
    </>
  );
};

interface ProductNameProps {
  currency: Currency;
  product: Product;
}

const ProductName = ({ currency, product }: ProductNameProps) => {
  return (
    <div className="text-gray-700 dark:text-gray-400">
      <div className="flex gap-2 text-xl items-baseline">
        {product.display_name}
        <span className="text-xs">{currency.name}</span>
      </div>
    </div>
  );
};

interface ProductPriceProps {
  productId: string;
  dailyStats: AnnotatedProductStats;
}

const ProductPrice = ({ productId, dailyStats }: ProductPriceProps) => {
  // Fetch initial state
  const priceRef = useRef(useStore.getState().prices[productId]?.price);
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useStore.subscribe(
        (state) => (priceRef.current = state.prices[productId]?.price)
      ),
    [productId]
  );

  const [price, setPrice] = useState(priceRef.current || dailyStats.last);

  useInterval(() => {
    setPrice(priceRef.current || dailyStats.last);
  }, 2000);

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

interface SecondaryStatsProps {
  product: Product;
  dailyStats: AnnotatedProductStats;
}

const SecondaryStats = ({ product, dailyStats }: SecondaryStatsProps) => {
  const { minimumQuoteDigits } = product;
  const { low, high } = dailyStats;
  return (
    <div className="mb-4 text-xs text-gray-700 dark:text-gray-400">
      <div>
        {formatPrice(low, minimumQuoteDigits)}
        {" - "}
        {formatPrice(high, minimumQuoteDigits)}
      </div>
    </div>
  );
};

export default ProductSummary;
