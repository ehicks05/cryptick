import { CandleGranularity } from 'services/cbp/types/product';
import { CHART_TIMESPANS, type ChartTimespan } from 'types';

const APP = {
	NAME: 'cryptick',
	REPO_URL: 'https://www.github.com/ehicks05/cryptick/',
	AUTHOR_URL: 'https://ehicks.net',
} as const;

const DEFAULT = {
	CANDLE_GRANULARITY: CandleGranularity.FIFTEEN_MINUTES as CandleGranularity,
	CHART_HEIGHT: 'h-32',
	CHART_TIMESPAN: CHART_TIMESPANS['24H'] as ChartTimespan,
	SELECTED_PRODUCT_IDS: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
};

export { APP, DEFAULT };
