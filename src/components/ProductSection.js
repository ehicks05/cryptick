import React from "react";

const ProductSection = ({ productId, productPrice, productStats }) => {
  return (
    <div className="w-56">
      <div className="text-gray-700 dark:text-gray-400">{productId}</div>
      <span className="text-2xl font-semibold" id={`${productId}Price`}>
        {productPrice?.price}
      </span>
      <div className="text-xs">
        {productStats &&
          Object.entries(productStats)
            .filter(([k, _v]) => k !== "productId")
            .map(([k, v]) => {
              return (
                <div key={k}>
                  {k}: {Math.round(v)}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default React.memo(ProductSection);
