import React from "react";
import styled from "styled-components";
import { getPercentChange } from "utils";
import Chart from "./Chart";
import ProductSummary from "./ProductSummary";

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

const Product = ({
  product,
  productPrice,
  productStats,
  currency,
  productCandles,
}) => {
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
        product={product}
        productPrice={productPrice}
        dailyStats={dailyStats}
        currency={currency}
      />
      <div className="h-24">
        <Chart
          candles={productCandles || []}
          color={isPositive ? "rgba(16, 185, 129)" : "rgb(239, 68, 68)"}
        />
      </div>
    </StyledCard>
  );
};

const borderColor = (isPositive) =>
  isPositive
    ? "border-green-300 dark:border-green-900 hover:border-green-500 dark:hover:border-green-700"
    : "border-red-300 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700";

export default React.memo(Product);
