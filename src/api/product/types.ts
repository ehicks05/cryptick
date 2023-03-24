import { OrderSide, ISO_8601_MS_UTC } from "api/types";

export interface Product {
  base_currency: string;
  base_increment: string;
  /** Maximum order size */
  base_max_size: string;
  /** Minimum order size */
  base_min_size: string;
  cancel_only: boolean;
  display_name: string;
  id: string;
  limit_only: boolean;
  margin_enabled: boolean;
  max_market_funds: string;
  min_market_funds: string;
  post_only: boolean;
  quote_currency: string;
  /**
   * Increment steps for min/max order size. The order price must be a multiple of this increment (i.e. if the
   * increment is 0.01, order prices of 0.001 or 0.021 would be rejected).
   */
  quote_increment: string;
  status: "online";
  status_message: string;
  trading_disabled: boolean;

  // ADDED LOCALLY
  minimumQuoteDigits: number;
  minimumBaseDigits: number;
}

// Snapshot information about the last trade (tick), best bid/ask and 24h volume.
export interface ProductTicker {
  ask: string;
  bid: string;
  price: string;
  size: string;
  time: string;
  trade_id: number;
  volume: string;
}

export interface ProductStats {
  high: string;
  last: string;
  low: string;
  open: string;
  volume: string;
  // volume_30day: string;
}

export interface Trade {
  price: string;
  side: OrderSide;
  size: string;
  time: ISO_8601_MS_UTC;
  trade_id: number;
}

/** Accepted granularity in seconds to group historic rates. */
export enum CandleGranularity {
  ONE_MINUTE = 60,
  FIVE_MINUTES = 300,
  FIFTEEN_MINUTES = 900,
  ONE_HOUR = 3600,
  SIX_HOURS = 21600,
  ONE_DAY = 86400,
}

export interface BaseHistoricRateRequest {
  /** Desired time slice in seconds. */
  granularity: CandleGranularity;
}

export interface HistoricRateRequestWithTimeSpan
  extends BaseHistoricRateRequest {
  /** Opening time (ISO 8601) of last candle, i.e. "2020-04-28T23:00:00.000Z" */
  end: ISO_8601_MS_UTC;
  /** Opening time (ISO 8601) of first candle, i.e. "2020-04-28T00:00:00.000Z" */
  start: ISO_8601_MS_UTC;
}

export type HistoricRateRequest =
  | BaseHistoricRateRequest
  | HistoricRateRequestWithTimeSpan;

type Close = number;
type High = number;
type Low = number;
type Open = number;
type Timestamp = number;
type Volume = number;

export interface Candle {
  /** ID of base asset */
  base: string;
  /** Closing price (last trade) in the bucket interval */
  close: Close;
  /** ID of quote asset */
  counter: string;
  /** Highest price during the bucket interval */
  high: High;
  /** Lowest price during the bucket interval */
  low: Low;
  /** Opening price (first trade) in the bucket interval */
  open: Open;
  /** Bucket start time in simplified extended ISO 8601 format */
  openTimeInISO: ISO_8601_MS_UTC;
  /** Bucket start time converted to milliseconds (note: Coinbase Pro actually uses seconds) */
  openTimeInMillis: number;
  /** Product ID / Symbol */
  productId: string;
  /** Candle size in milliseconds */
  sizeInMillis: number;
  /** Volume of trading activity during the bucket interval */
  volume: Volume;
}

export type DailyCandles = Record<
  string,
  {
    productId: string;
    candles: RawCandle[];
  }
>;

export type BulkProductStats = Record<
  string,
  {
    stats_30day: {
      volume: Volume;
    };
    stats_24hour: {
      open: Open;
      high: High;
      low: Low;
      last: Close;
      volume: Volume;
    };
  }
>;

export type RawCandle = [Timestamp, Low, High, Open, Close, Volume];
