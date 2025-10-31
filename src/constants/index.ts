import { CandleGranularity } from 'api/types/product';

const APP = {
	NAME: 'cryptick',
	REPO_URL: 'https://www.github.com/ehicks05/cryptick/',
	AUTHOR_URL: 'https://ehicks.net',
};

const DEFAULT = {
	CANDLE_GRANULARITY: CandleGranularity.FIFTEEN_MINUTES,
	CHART_HEIGHT: 'h-32',
	SELECTED_PRODUCT_IDS: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
};

export { APP, DEFAULT };
