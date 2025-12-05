export * from './timespan';

export interface CryptickProduct {
	id: string;
	displayName: string;
	
	baseAsset: string;
	quoteAsset: string;
			
	minBaseDigits: number;
	minQuoteDigits: number;
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
