import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { useInterval, useMeasure } from "react-use";
import CandleChart from "./CandleChart";
import History from "./History";
import ProductSummary from "./ProductSummary";
import { getPercentChange } from "utils";
import { getCandles } from "../api/api";
import { subSeconds, formatISO } from "date-fns";
import useStore from "../store";

const StyledCard = styled.div.attrs(({ className }) => ({
  className,
}))`
  background-image: ${(props) =>
    `linear-gradient(to top, ${
      props.isPositive ? "rgba(6, 78, 59, .15)" : "rgba(153, 27, 27, .15)"
    }, rgba(0,0,0,0))`};
`;

const ProductDetail = () => {
  const [ref, { height }] = useMeasure();
  const [innerRef, { height: innerHeight }] = useMeasure();
  const { productId } = useParams();
  const [granularity, setGranularity] = useState(900);
  const [candles, setCandles] = useState([]);
  const productStats = useStore(
    useCallback((state) => state.stats[productId].stats_24hour, [productId])
  );

  const fetchCandles = useCallback(
    async (date) => {
      const [candles1, candles2] = await Promise.all(
        [...Array(2)].map((_i, i) =>
          getCandles(
            productId,
            granularity,
            formatISO(subSeconds(date, granularity * 300 * (i + 1))),
            formatISO(subSeconds(date, granularity * 300 * i))
          )
        )
      );

      return [...(candles1 || []), ...(candles2 || [])];
    },
    [productId, granularity]
  );

  useEffect(() => {
    const init = async () => {
      const candles = await fetchCandles(new Date());
      if (candles) setCandles(candles);
    };
    init();
  }, [fetchCandles]);

  useInterval(() => {
    const update = async () => {
      const candles = await fetchCandles(new Date());
      if (candles) setCandles(candles);
    };
    update();
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
            productId={productId}
            dailyStats={dailyStats}
            granularityPicker={granularityPicker}
          />
        </div>
        <div className="flex-grow">
          <CandleChart
            height={height - innerHeight}
            candles={candles}
            productId={productId}
          />
        </div>
      </StyledCard>
      <div
        className="hidden md:block overflow-y-hidden h-full"
        style={{ maxHeight: height }}
      >
        <History productId={productId} />
      </div>
    </div>
  );
};

const borderColor = (isPositive) =>
  isPositive
    ? "border-green-300 dark:border-green-900"
    : "border-red-300 dark:border-red-900";

export default React.memo(ProductDetail);
