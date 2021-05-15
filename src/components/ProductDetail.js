import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import useDimensions from "react-use-dimensions";
import { formatPrice, formatPercent } from "../utils";
import CandleChart from "./CandleChart";
import History from "./History";

const getPercentChange = (from, to) => {
  const delta = to - from;
  return delta / from;
};

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
  candles,
  prices,
  throttledMessages,
}) => {
  const [ref, { height }] = useDimensions();
  const [innerRef, { height: innerHeight }] = useDimensions();
  const { productId } = useParams();
  const product = products[productId];
  const productPrice = prices[productId];
  const productStats = stats[productId].stats_24hour;
  const currency = currencies[products[productId].base_currency];
  const productCandles = candles[productId]?.candles || [];

  const percent = getPercentChange(productStats.open, productStats.last);
  const isPositive = percent >= 0;
  const dailyStats = {
    ...productStats,
    percent,
    isPositive,
  };

  const borderColor = isPositive
    ? "border-green-300 dark:border-green-900"
    : "border-red-300 dark:border-red-900";

  return (
    <div
      ref={ref}
      className="h-full flex-grow flex flex-col md:flex-row gap-4 p-4"
    >
      <div className="flex flex-col flex-grow-0 md:flex-grow h-full">
        <div>Chart</div>
        <StyledCard
          isPositive={isPositive}
          className={`flex-grow flex flex-col p-4 border rounded ${borderColor}`}
        >
          <div ref={innerRef}>
            <ProductName currency={currency} product={product} />
            <ProductPrice
              product={product}
              price={productPrice?.price}
              dailyStats={dailyStats}
            />
            <SecondaryStats product={product} dailyStats={dailyStats} />
          </div>
          <div className="flex-grow">
            <CandleChart
              height={height - innerHeight}
              candles={productCandles || []}
            />
          </div>
        </StyledCard>
      </div>
      <div className="overflow-y-hidden h-full" style={{ maxHeight: height }}>
        <History messages={throttledMessages[productId] || []} />
      </div>
    </div>
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

const SecondaryStats = ({ product, dailyStats }) => {
  const { minimumQuoteDigits } = product;
  const { low, high, volume } = dailyStats;
  return (
    <div className="mb-4 text-xs">
      <div>
        <span>l: {formatPrice(low, minimumQuoteDigits)}</span>
        <span className="ml-4">h: {formatPrice(high, minimumQuoteDigits)}</span>
      </div>
      <div>v: {formatPrice(Math.round(volume))}</div>
    </div>
  );
};

export default React.memo(ProductDetail);
