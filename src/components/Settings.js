import React, { useState } from "react";
import _ from "lodash";
import { FaLock, FaLockOpen } from "react-icons/fa";

const Settings = ({
  showSettings,
  isReorderEnabled,
  setIsReorderEnabled,
  currencies,
  products,
  selectedProducts,
  toggleProduct,
}) => {
  const quoteCurrencies = _.chain(Object.values(products))
    .map((product) => product.quote_currency)
    .uniq()
    .sortBy((c) => currencies[c].details.sort_order)
    .value();

  const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState(
    quoteCurrencies[0]
  );

  const gridClasses =
    "grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1";

  const display = showSettings ? "block" : "hidden";

  return (
    <div className={`max-w-screen-xl m-auto p-4 ${display}`}>
      <div>Reorder Cards:</div>
      <DndLock isDnd={isReorderEnabled} setIsDnd={setIsReorderEnabled} />

      <div className="mt-4">Quote Currency: </div>
      <div className={gridClasses}>
        {Object.values(quoteCurrencies).map((quoteCurrency) => {
          return (
            <Button
              key={quoteCurrency}
              text={quoteCurrency}
              selected={quoteCurrency === selectedQuoteCurrency}
              onClick={() => setSelectedQuoteCurrency(quoteCurrency)}
            />
          );
        })}
      </div>

      <div className="mt-4">Base Currency: </div>
      <div className={gridClasses}>
        {Object.values(products)
          .filter(
            (product) =>
              !selectedQuoteCurrency ||
              product.quote_currency === selectedQuoteCurrency
          )
          .map((product) => {
            return (
              <Button
                key={product.id}
                text={product.base_currency}
                selected={selectedProducts.includes(product.id)}
                onClick={() => toggleProduct(product.id)}
              />
            );
          })}
      </div>
    </div>
  );
};

const DndLock = ({ isDnd, setIsDnd }) => {
  const Icon = isDnd ? FaLockOpen : FaLock;
  return (
    <Icon
      className="mb-2"
      role="button"
      color="gray"
      title="Toggle Drag n Drop"
      onClick={() => setIsDnd(!isDnd)}
    />
  );
};

const Button = ({ text, selected, onClick }) => {
  return (
    <button
      className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer 
      ${
        selected
          ? "bg-green-500 text-gray-50"
          : "text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default React.memo(Settings);
