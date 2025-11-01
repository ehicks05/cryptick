export type Direction = 'POS' | 'NEG' | 'UNK';

export const CHART_TIMESPANS = {
	'24H': '24H',
	'7D': '7D',
	'30D': '1M',
	'1Y': '1Y',
} as const;

export type ChartTimespan = keyof typeof CHART_TIMESPANS;
