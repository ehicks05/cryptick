const getProducts = async () => {
  const SUPPORTED_QUOTE_CURRENCIES = ["BTC", "USD"];
  const API_PRODUCTS = (
    await (await fetch("https://api.pro.coinbase.com/products")).json()
  )
    .filter((product) =>
      SUPPORTED_QUOTE_CURRENCIES.includes(product.quote_currency)
    )
    .sort((a, b) => {
      if (a.quote_currency !== b.quote_currency)
        return a.quote_currency.localeCompare(b.quote_currency);
      if (a.base_currency !== b.base_currency)
        return a.base_currency.localeCompare(b.base_currency);
      return 0;
    });

  return API_PRODUCTS;
};

export { getProducts };
