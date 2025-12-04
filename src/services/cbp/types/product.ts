import type { ISO_8601_MS_UTC, OrderSide } from 'services/cbp/types/common';

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
	quote_increment: string;
	status: 'delisted' | 'online';
	status_message: string;
	trading_disabled: boolean;
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

export type Stats24Hour = {
	open: number;
	high: number;
	low: number;
	last: number;
	volume: number;
};

export type BulkProductStat = {
	stats_30day: {
		volume: number;
	};
	stats_24hour: Stats24Hour;
};

export type BulkProductStats = Record<string, BulkProductStat>;

export type CoinbaseCandle = [number, number, number, number, number, number];
