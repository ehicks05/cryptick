import React from "react";

const Settings = ({
  showSettings,
  products,
  selectedProducts,
  toggleProduct,
}) => {
  return (
    <div className={`p-4 ${showSettings ? "block" : "hidden"}`}>
      <div className="my-1">
        <div>Trading Pairs: </div>
        <div className="flex flex-wrap w-full">
          {products.map((product) => {
            return (
              <ProductButton
                key={product.id}
                product={product}
                selected={selectedProducts.includes(product.id)}
                onClick={() => toggleProduct(product.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductButton = ({ product, selected, onClick }) => {
  return (
    <button
      key={product.id}
      className={`whitespace-nowrap px-2 py-1 m-1 rounded cursor-pointer 
      ${
        selected
          ? "bg-green-500 text-gray-50"
          : "text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      {product.id}
    </button>
  );
};

export default React.memo(Settings);
