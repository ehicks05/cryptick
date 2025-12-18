import { CandleGranularity } from 'services/cbp/types/product';
import { CHART_TIMESPANS, type ChartTimespan, type SizeUnit } from 'types';

export const DEFAULT = {
	CANDLE_GRANULARITY: CandleGranularity.FIFTEEN_MINUTES as CandleGranularity,
	CHART_HEIGHT: 'h-32',
	CHART_TIMESPAN: CHART_TIMESPANS['24H'] as ChartTimespan,
	SELECTED_PRODUCT_IDS: ['coinbase:BTC-USD', 'coinbase:ETH-USD', 'coinbase:SOL-USD'],
	// SELECTED_PRODUCT_IDS: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
	HISTORY_SIZE_UNIT: 'base' as SizeUnit,
};
