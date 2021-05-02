import { API_URL } from "./constants";

const CURR_URL = `${API_URL}/currencies`;
const PROD_URL = `${API_URL}/products`;

const getCurrencies = async () => {
  return (await (await fetch(CURR_URL)).json())
    .sort((a, b) => {
      return a.details.sort_order - b.details.sort_order;
    })
    .reduce(
      (agg, curr) => ({
        ...agg,
        [curr.id]: curr,
      }),
      {}
    );
};

const getProducts = async () => {
  const SUPPORTED_QUOTE_CURRENCIES = ["BTC", "USD"];
  const API_PRODUCTS = (await (await fetch(PROD_URL)).json())
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
  const stats = await (await fetch(`${PROD_URL}/${productId}/stats`)).json();

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

export { getCurrencies, getProducts, get24HourStats };
