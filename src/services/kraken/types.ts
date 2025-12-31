export interface Asset {
	aclass: 'currency';
	altname: string;
	decimals: number;
	display_decimals: number;
	status:
		| 'enabled'
		| 'deposit_only'
		| 'withdrawal_only'
		| 'funding_temporarily_disabled';
	collateral_value?: number;
	margin_rate?: number;
}

export interface AssetsResponse {
	error: string[];
	result: Record<string, Asset>;
}

export interface AssetPair {
	altname: string;
	wsname: string;
	aclass_base: 'currency';
	base: string;
	aclass_quote: 'currency';
	quote: string;
	cost_decimals: number;
	pair_decimals: number;
	lot_decimals: number;
	lot_multiplier: number;
	leverage_buy: number[];
	leverage_sell: number[];
	fees: [number, number][];
	fees_maker: [number, number][];
	fee_volume_currency: string;
	margin_call: number;
	margin_stop: number;
	ordermin: string;
	costmin: string;
	tick_size: string;
	status: 'online' | 'cancel_only' | 'post_only' | 'limit_only' | 'reduce_only';
}

export interface AssetPairsResponse {
	error: string[];
	result: Record<string, AssetPair>;
}

// [time, open, high, low, close, vwap, volume, count]
export type Ohlc = [number, string, string, string, string, string, string, number];

interface OhlcResult {
	// last: number;
	[key: string]: Ohlc[];
}

export interface OhlcResponse {
	error: string[];
	result: OhlcResult;
}

export interface WsTickerResponse {
	channel: string;
	type: 'snapshot' | 'update';
	data: {
		symbol: string;
		bid: number;
		bid_qty: number;
		ask: number;
		ask_qty: number;
		last: number;
		volume: number;
		vwap: number;
		low: number;
		high: number;
		change: number;
		change_pct: number;
		volume_usd: number;
		timestamp: string;
	};
}

export interface WsTradesResponse {
	channel: 'trade';
	type: 'snapshot' | 'update';
	data: {
		symbol: string;
		side: 'buy' | 'sell';
		qty: number;
		price: number;
		ord_type: 'limit' | 'market';
		trade_id: number;
		timestamp: string;
	}[];
}

export type WsTrade = WsTradesResponse['data'][number];

export type Trade = [string, string, number, 'b' | 's', 'm' | 'l', string, number];

interface TradeResult {
	// last: number;
	[key: string]: Trade[];
}

export interface TradesResponse {
	error: string[];
	result: TradeResult;
}
