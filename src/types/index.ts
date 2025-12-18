export * from './timespan';

export interface CryptickProduct {
	id: string;
	displayName: string;
	exchange: Exchange;

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

export const EXCHANGES = {
	coinbase: 'coinbase',
	binance: 'binance',
	kraken: 'kraken',
};
export type Exchange = keyof typeof EXCHANGES;

export type SizeUnit = 'base' | 'quote';
