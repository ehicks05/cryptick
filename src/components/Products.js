import React from "react";
import ProductSection from "./ProductSection";

const Products = ({
  currencies,
  products,
  stats,
  candles,
  selectedProductIds,
  prices,
}) => {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center p-4">
      {!!Object.keys(currencies).length &&
        !!Object.keys(products).length &&
        !!Object.keys(stats).length &&
        !!Object.keys(candles).length &&
        selectedProductIds.map((selectedProductId) => {
          return (
            <ProductSection
              key={selectedProductId}
              product={products[selectedProductId]}
              productPrice={prices[selectedProductId]}
              productStats={stats[selectedProductId]}
              currency={currencies[products[selectedProductId].base_currency]}
              productCandles={candles[selectedProductId]?.candles || []}
            />
          );
        })}
    </div>
  );
};

export default React.memo(Products);
