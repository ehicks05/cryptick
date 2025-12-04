/** ISO 8601 timestamp with microseconds in Coordinated Universal Time (UTC), i.e. "2014-11-06T10:34:47.123456Z" */
export type ISO_8601_MS_UTC = string;

export enum OrderSide {
	BUY = 'buy',
	SELL = 'sell',
}

/** @see https://docs.cloud.coinbase.com/exchange/docs/pagination */
export interface Pagination {
	/** Request page after (older) this pagination id. */
	after?: string;
	/** Request page before (newer) this pagination id. */
	before?: string;
	/** Number of results per request. Maximum 100. Default 100. */
	limit?: number;
}

export interface PaginatedData<PayloadType> {
	data: PayloadType[];
	pagination: { after?: string; before?: string };
}
