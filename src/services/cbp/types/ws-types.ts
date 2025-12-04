import type { ISO_8601_MS_UTC, OrderSide } from './common';

export enum WebSocketRequestType {
	SUBSCRIBE = 'subscribe',
	UNSUBSCRIBE = 'unsubscribe',
}

export enum WebSocketResponseType {
	/** Most failure cases will cause an error message (a message with the type "error") to be emitted. */
	ERROR = 'error',
	/** Heartbeats include sequence numbers and last trade ids that can be used to verify no messages were missed. */
	HEARTBEAT = 'heartbeat',
	/** Latest match between two orders. */
	LAST_MATCH = 'last_match',
	/** When subscribing to the 'level2' channel it will send an initial snapshot message with the corresponding product ids, bids and asks to represent the entire order book. */
	LEVEL2_SNAPSHOT = 'snapshot',
	/** Subsequent updates of a 'level2' subscription. The `time` property of `l2update` is the time of the event as recorded by our trading engine. Please note that `size` is the updated size at that price level, not a delta. A size of "0" indicates the price level can be removed. */
	LEVEL2_UPDATE = 'l2update',
	/** The status channel will send all products and currencies on a preset interval. */
	STATUS = 'status',
	/** Once a subscribe or unsubscribe message is received, the server will respond with a subscriptions message that lists all channels you are subscribed to. */
	SUBSCRIPTIONS = 'subscriptions',
	/** The ticker channel provides real-time price updates every time a match happens. */
	TICKER = 'ticker',
}

export type WebSocketResponse = WebSocketMessage & {
	type: WebSocketResponseType;
};

type WebSocketMessage =
	| Record<string, string | number | boolean>
	// | WebSocketStatusMessage
	| WebSocketTickerMessage;
// | WebSocketErrorMessage

export interface WebSocketTickerMessage {
	best_ask: string;
	best_bid: string;
	high_24h: string;
	last_size: string;
	low_24h: string;
	open_24h: string;
	price: string;
	product_id: string;
	sequence: number;
	side: OrderSide;
	time: ISO_8601_MS_UTC;
	trade_id: number;
	type: WebSocketResponseType.TICKER;
	volume_24h: string;
	volume_30d: string;
}

// digested
export interface TickerMessage {
	productId: string;
	sequence: number;
	time: string;
	side: OrderSide;
	price: string;
	last_size: string;
}
