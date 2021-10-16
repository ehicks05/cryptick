import _ from "lodash";
import pThrottle from "p-throttle";
import { formatISO, subDays } from "date-fns";
import { API_URL } from "./constants";

const CURR_URL = `${API_URL}/currencies`;
const PROD_URL = `${API_URL}/products`;

const getCurrencies = async () => {
  const data = await (await fetch(CURR_URL)).json();
  return _.chain(data).sortBy(["sort_order"]).keyBy("id").value();
};

const getProducts = async () => {
  const data = await (await fetch(PROD_URL)).json();
  return _.chain(data)
    .sortBy(["quote_currency", "base_currency"])
    .map((product) => ({
      ...product,
      minimumQuoteDigits: product.quote_increment.substring(
        product.quote_increment.indexOf(".") + 1
      ).length,
      minimumBaseDigits: product.base_increment.substring(
        product.base_increment.indexOf(".") + 1
      ).length,
    }))
    .keyBy("id")
    .value();
};

const get24HourStats = async () => {
  return await (await fetch(`${PROD_URL}/stats`)).json();
};

const getCandles = async (productId, granularity, start, end) => {
  try {
    return await (
      await fetch(`${PROD_URL}/${productId}/candles?granularity=${granularity}${start ? `&start=${start}` : ''}${end ? `&end=${end}` : ''}`)
    ).json();
  } catch (err) {
    console.log(err);
    return [];
  }
};

// see https://docs.cloud.coinbase.com/exchange/docs/rate-limits
const throttle = pThrottle({
  limit: 10,
  interval: 1000,
});

const getDailyCandles = async (productIds) => {
  const throttledFetch = throttle(async (productId) => {
    const candles = await getCandles(productId, 900,
      formatISO(subDays(new Date(), 1)),
      formatISO(new Date()));
    return { productId, candles };
  });

  const data = (await Promise.all(productIds.map(throttledFetch))).flat();
  return _.keyBy(data, "productId");
};

export { getCurrencies, getProducts, get24HourStats, getDailyCandles, getCandles };
