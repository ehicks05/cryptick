import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useInterval, useMeasure } from "react-use";
import CandleChart from "./CandleChart";
import History from "./History";
import ProductSummary from "./ProductSummary";
import { getPercentChange } from "utils";
import { getCandles } from "../api/api";
import { subSeconds, formatISO } from "date-fns";
import useStore from "../store";
import { RawCandle } from "api/product/types";

const borderColor = (isPositive: boolean) =>
  isPositive
    ? "border-green-300 dark:border-green-900"
    : "border-red-300 dark:border-red-900";

const background = (isPositive: boolean) =>
  `bg-gradient-to-t ${
    isPositive ? "from-[rgba(6,78,59,.15)]" : "from-[rgba(153,27,27,.15)]"
  } to-transparent`;

const ProductDetail = () => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const [innerRef, { height: innerHeight }] = useMeasure<HTMLDivElement>();
  const { productId } = useParams();
  const [granularity, setGranularity] = useState(900);
  const [candles, setCandles] = useState<RawCandle[]>([]);
  const productStats = useStore(
    useCallback(
      (state) => state.stats[productId || ""].stats_24hour,
      [productId]
    )
  );

  const fetchCandles = useCallback(
    async (date: Date) => {
      const [candles1, candles2] = await Promise.all(
        [...Array(2)].map((_i, i) =>
          getCandles(
            productId || "",
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
      onChange={(e) => setGranularity(Number(e.target.value))}
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

  if (!productId) return <div>ProductId is missing...</div>;

  return (
    <div
      ref={ref}
      className="h-full flex-grow flex flex-col md:flex-row gap-4 p-4"
    >
      <div
        className={`flex-grow flex flex-col p-4 border rounded ${borderColor(
          isPositive
        )} ${background(isPositive)}`}
      >
        <div ref={innerRef}>
          <ProductSummary
            productId={productId}
            dailyStats={dailyStats}
            // granularityPicker={granularityPicker}
          />
        </div>
        <div className="flex-grow">
          <CandleChart
            height={height - innerHeight}
            candles={candles}
            productId={productId}
          />
        </div>
      </div>
      <div
        className="hidden md:block overflow-y-hidden h-full"
        style={{ maxHeight: height }}
      >
        <History productId={productId} />
      </div>
    </div>
  );
};

export default React.memo(ProductDetail);
