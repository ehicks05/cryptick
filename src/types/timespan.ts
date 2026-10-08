import { CandleGranularity } from '@/services/cbp/types/product';

export const CHART_TIMESPANS = {
	'1D': '1D',
	'1W': '1W',
	'1M': '1M',
	'1Y': '1Y',
} as const;
export type ChartTimespan = keyof typeof CHART_TIMESPANS;

export const CHART_TIMESPAN_GRANULARITIES: Record<ChartTimespan, CandleGranularity> =
	{
		'1D': CandleGranularity.FIFTEEN_MINUTES,
		'1W': CandleGranularity.ONE_HOUR,
		'1M': CandleGranularity.SIX_HOURS,
		'1Y': CandleGranularity.ONE_DAY,
	} as const;

export const CHART_TIMESPAN_SECONDS: Record<ChartTimespan, number> = {
	'1D': 60 * 60 * 24 * 1,
	'1W': 60 * 60 * 24 * 7,
	'1M': 60 * 60 * 24 * 30,
	'1Y': 60 * 60 * 24 * 365,
} as const;
