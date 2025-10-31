import { CandleGranularity } from 'api/types/product';

const APP = {
	NAME: 'cryptick',
	REPO_URL: 'https://www.github.com/ehicks05/cryptick/',
	AUTHOR_URL: 'https://ehicks.net',
}

const DEFAULT_CANDLE_GRANULARITY = CandleGranularity.FIFTEEN_MINUTES;
const DEFAULT_CHART_HEIGHT = 'h-32';
const DEFAULT_SELECTED_PRODUCT_IDS = ['BTC-USD', 'ETH-USD', 'SOL-USD'];

export {
	APP,
	DEFAULT_CANDLE_GRANULARITY,
	DEFAULT_CHART_HEIGHT,
	DEFAULT_SELECTED_PRODUCT_IDS,
};
