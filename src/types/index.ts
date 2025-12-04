export * from './timespan';

export interface CryptickProduct {
	base_currency: string;
	base_increment: string;
	display_name: string;
	id: string;
	quote_currency: string;
	status: 'delisted' | 'online';
	status_message: string;
	trading_disabled: boolean;
	minimumQuoteDigits: number;
	minimumBaseDigits: number;
}

export interface CryptickCandle {
	close: number;
	high: number;
	low: number;
	open: number;
	productId: string;
	timestamp: number;
	volume: number;
}

export type Direction = 'POS' | 'NEG' | 'UNK';
