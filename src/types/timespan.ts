import { CandleGranularity } from 'services/cbp/types/product';

export const CHART_TIMESPANS = {
	'24H': '24H',
	'7D': '7D',
	'30D': '30D',
	'1Y': '1Y',
} as const;

export const CHART_TIMESPAN_GRANULARITIES = {
	'24H': CandleGranularity.FIFTEEN_MINUTES,
	'7D': CandleGranularity.ONE_HOUR,
	'30D': CandleGranularity.SIX_HOURS,
	'1Y': CandleGranularity.ONE_DAY,
} as const;

const ONE_DAY = 60 * 60 * 24 * 1;
const SEVEN_DAYS = 60 * 60 * 24 * 7;
const THIRTY_DAYS = 60 * 60 * 24 * 30;
const ONE_YEAR = 60 * 60 * 24 * 365;

export const CHART_TIMESPAN_SECONDS = {
	'24H': ONE_DAY,
	'7D': SEVEN_DAYS,
	'30D': THIRTY_DAYS,
	'1Y': ONE_YEAR,
} as const;

export type ChartTimespan = keyof typeof CHART_TIMESPANS;
