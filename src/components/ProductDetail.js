import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { useInterval, useMeasure } from "react-use";
import CandleChart from "./CandleChart";
import History from "./History";
import ProductSummary from "./ProductSummary";
import { getPercentChange } from "utils";
import { getCandles } from "../api";

const StyledCard = styled.div.attrs(({ className }) => ({
  className,
}))`
  background-image: ${(props) =>
    `linear-gradient(to top, ${
      props.isPositive ? "rgba(6, 78, 59, .15)" : "rgba(153, 27, 27, .15)"
    }, rgba(0,0,0,0))`};
`;

const ProductDetail = ({
  currencies,
  products,
  stats,
  prices,
  throttledMessages,
}) => {
  const [ref, { height }] = useMeasure();
  const [innerRef, { height: innerHeight }] = useMeasure();
  const { productId } = useParams();
  const product = products[productId];
  const productPrice = prices[productId];
  const productStats = stats[productId].stats_24hour;
  const currency = currencies[products[productId].base_currency];
  const [candles, setCandles] = useState([]);
  const [granularity, setGranularity] = useState(900);

  const fetchCandles = useCallback(async () => {
    setCandles(await getCandles(productId, granularity));
  }, [productId, granularity]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  useInterval(() => {
    fetchCandles();
  }, 60000);

  const percent = getPercentChange(productStats.open, productStats.last);
  const isPositive = percent >= 0;
  const dailyStats = {
    ...productStats,
    percent,
    isPositive,
  };

  const granularityPicker = (
    <select
      className="text-xs dark:bg-black"
      onChange={(e) => setGranularity(e.target.value)}
      value={granularity}
    >
      {[
        { value: 60, label: "1m" },
        { value: 300, label: "5m" },
        { value: 900, label: "15m" },
        { value: 3600, label: "1h" },
        { value: 21600, label: "6h" },
        { value: 86400, label: "1d" },
      ].map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  return (
    <div
      ref={ref}
      className="h-full flex-grow flex flex-col md:flex-row gap-4 p-4"
    >
      <StyledCard
        isPositive={isPositive}
        className={`flex-grow flex flex-col p-4 border rounded ${borderColor(
          isPositive
        )}`}
      >
        <div ref={innerRef}>
          <ProductSummary
            product={product}
            productPrice={productPrice}
            dailyStats={dailyStats}
            currency={currency}
            granularityPicker={granularityPicker}
          />
        </div>
        <div className="flex-grow">
          <CandleChart
            height={height - innerHeight}
            candles={candles}
            productPrice={productPrice}
          />
        </div>
      </StyledCard>
      <div
        className="hidden md:block overflow-y-hidden h-full"
        style={{ maxHeight: height }}
      >
        <History messages={throttledMessages[productId] || []} />
      </div>
    </div>
  );
};

const borderColor = (isPositive) =>
  isPositive
    ? "border-green-300 dark:border-green-900"
    : "border-red-300 dark:border-red-900";

export default React.memo(ProductDetail);
