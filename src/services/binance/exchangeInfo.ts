import type { SpotRestAPI } from "@binance/spot";
import type { CryptickProduct } from "types";
import { client } from "./client";
import { throttle } from "./throttle";

type Symbol = SpotRestAPI.ExchangeInfoResponseSymbolsInner;

const sort = (o1: Symbol, o2: Symbol) => {
  const qc = (o1.quoteAsset || "").localeCompare(o2.quoteAsset || "");
  if (qc !== 0) return qc;
  return (o1.baseAsset || "").localeCompare(o2.baseAsset || "");
};

// The number of digits to show is based on tickSize. A tickSize of .01
// results in 12.34, a tickSize of .001 results in 12.345, etc...
const toMinimumDigits = (increment: string) =>
  increment.substring(increment.indexOf(".") + 1).length;

const toCryptickProduct = (symbol: Symbol): CryptickProduct => {
  const tickSize =
    symbol.filters?.find((filter) => filter.filterType === "PRICE_FILTER")
      ?.tickSize || ".01";

  return {
    id: symbol.symbol || "",
    displayName: symbol.symbol || "",
    exchange: "binance",
    baseAsset: symbol.baseAsset || "",
    quoteAsset: symbol.quoteAsset || "",
    minBaseDigits: toMinimumDigits(tickSize), // do we need this?
    minQuoteDigits: toMinimumDigits(tickSize),
  };
};

const _exchangeInfo = async () => {
  const response = await client({ path: "/api/v3/exchangeInfo" });
  const data: SpotRestAPI.ExchangeInfoResponse = await response.json();
  const symbols = data.symbols || [];

  return {
    ...data,
    symbols: symbols
      .filter((symbol) => symbol.status === "TRADING")
      .toSorted(sort)
      .map(toCryptickProduct),
  };
};

export const getExchangeInfo = throttle(_exchangeInfo);
