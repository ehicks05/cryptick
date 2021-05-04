import pRetry from "p-retry";
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
  return (await (await fetch(PROD_URL)).json())
    .filter((product) =>
      SUPPORTED_QUOTE_CURRENCIES.includes(product.quote_currency)
    )
    .sort((a, b) => {
      if (a.quote_currency !== b.quote_currency)
        return a.quote_currency.localeCompare(b.quote_currency);
      if (a.base_currency !== b.base_currency)
        return a.base_currency.localeCompare(b.base_currency);
      return 0;
    })
    .reduce(
      (agg, curr) => ({
        ...agg,
        [curr.id]: curr,
      }),
      {}
    );
};

const get24HourStats = async () => {
  return await (await fetch(`${PROD_URL}/stats`)).json();
};

const _getCandles = async (productId) => {
  return (
    await (
      await fetch(`${PROD_URL}/${productId}/candles?granularity=300`)
    ).json()
  )
    .reverse()
    .slice(12);
};

const getCandles = async (productIds) => {
  return (
    await Promise.all(
      productIds.map(async (productId) => {
        const candles = await pRetry(() => _getCandles(productId), {
          retries: 3,
        });
        return { productId, candles };
      })
    )
  )
    .flat()
    .reduce(
      (agg, curr) => ({
        ...agg,
        [curr.productId]: curr,
      }),
      {}
    );
};

export { getCurrencies, getProducts, get24HourStats, getCandles };
