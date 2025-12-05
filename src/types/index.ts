export * from './timespan';

export interface CryptickProduct {
	id: string;
	display_name: string;
	
	base_currency: string;
	quote_currency: string;
			
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
