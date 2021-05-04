import React from "react";

const Settings = ({
  showSettings,
  products,
  selectedProducts,
  toggleProduct,
}) => {
  return (
    <div
      className={`max-w-screen-xl m-auto p-4 ${
        showSettings ? "block" : "hidden"
      }`}
    >
      <div className="my-1">
        <div>Trading Pairs: </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-1">
          {Object.values(products).map((product) => {
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
      className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer 
      ${
        selected
          ? "bg-green-500 text-gray-50"
          : "text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      {product.display_name}
    </button>
  );
};

export default React.memo(Settings);
