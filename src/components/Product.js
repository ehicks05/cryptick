import React, {useCallback} from "react";
import styled from "styled-components";
import { getPercentChange } from "utils";
import Chart from "./Chart";
import ProductSummary from "./ProductSummary";
import useStore from '../store';

const StyledCard = styled.div.attrs(({ className }) => ({
  className,
}))`
  background-image: ${(props) =>
    `linear-gradient(to top, ${
      props.isPositive ? "rgba(6, 78, 59, .15)" : "rgba(153, 27, 27, .15)"
    }, rgba(0,0,0,0))`};

  :hover {
    background-image: ${(props) =>
      `linear-gradient(to top, ${
        props.isPositive ? "rgba(6, 78, 59, .30)" : "rgba(153, 27, 27, .30)"
      }, rgba(0,0,0,0))`};
  }
`;

const Product = ({ productId }) => {  
  const productStats = useStore(useCallback(state => state.stats[productId].stats_24hour, [productId]));
  const productCandles = useStore(useCallback(state => state.candles[productId]?.candles, [productId]));
  
  const percent = getPercentChange(productStats.open, productStats.last);
  const isPositive = percent >= 0;
  const dailyStats = {
    ...productStats,
    percent,
    isPositive,
  };

  return (
    <StyledCard
      isPositive={isPositive}
      className={`p-4 border rounded ${borderColor(isPositive)}`}
    >
      <ProductSummary
        productId={productId}
        dailyStats={dailyStats}
      />
      <Chart
        candles={productCandles || []}
        color={isPositive ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
        className="h-24"
      />
    </StyledCard>
  );
};

const borderColor = (isPositive) =>
  isPositive
    ? "border-green-300 dark:border-green-900 hover:border-green-500 dark:hover:border-green-700"
    : "border-red-300 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700";

export default React.memo(Product);
