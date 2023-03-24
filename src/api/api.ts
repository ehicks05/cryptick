import _ from "lodash";
import pThrottle from "p-throttle";
import { formatISO, subDays } from "date-fns";
import { REST_URL } from "./constants";
import { CandleGranularity, Product } from "./product/types";

const PROD_URL = `${REST_URL}/products`;

const getProducts = async () => {
  const data: Product[] = await (await fetch(PROD_URL)).json();
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

const getCandles = async (
  productId: string,
  granularity: CandleGranularity,
  start: string,
  end: string
) => {
  try {
    return await (
      await fetch(
        `${PROD_URL}/${productId}/candles?granularity=${granularity}${
          start ? `&start=${start}` : ""
        }${end ? `&end=${end}` : ""}`
      )
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

const getDailyCandles = async (productIds: string[]) => {
  const throttledFetch = throttle(async (productId: string) => {
    const candles = await getCandles(
      productId,
      900,
      formatISO(subDays(new Date(), 1)),
      formatISO(new Date())
    );
    return { productId, candles };
  });

  const data = (await Promise.all(productIds.map(throttledFetch))).flat();
  return _.keyBy(data, "productId");
};

export { getProducts, get24HourStats, getDailyCandles, getCandles };
