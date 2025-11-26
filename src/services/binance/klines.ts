import { SpotRestAPI } from "@binance/spot";
import { client } from "./client";

export const klines = async (params: SpotRestAPI.KlinesRequest) =>
  client.restAPI.klines(params);

const foo = await klines({
  symbol: "BTCUSDT",
  interval: SpotRestAPI.KlinesIntervalEnum.INTERVAL_15m,
});

const bar = await foo.data();

const zeroth = bar[0];

zeroth;
