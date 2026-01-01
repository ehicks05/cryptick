import { useBinanceTicker } from 'services/binance/useBinanceTicker';
import { useCoinbaseTicker } from 'services/cbp/useCoinbaseTicker';
import { useKrakenTicker } from 'services/kraken/useKrakenTicker';

export const useTickers = () => {
	useCoinbaseTicker();
	useBinanceTicker();
	useKrakenTicker();
};
