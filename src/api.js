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

const _get24HourStats = async (productId) => {
  const stats = await (
    await fetch(`https://api.pro.coinbase.com/products/${productId}/stats`)
  ).json();

  return { ...stats, productId };
};

const get24HourStats = async (productIds) => {
  const stats = await Promise.all(
    productIds.map((productId) => _get24HourStats(productId))
  );
  const statsObject = stats.reduce((agg, curr) => {
    return { ...agg, [curr.productId]: curr };
  }, {});
  return statsObject;
};

export { getProducts, get24HourStats };
