import { useCoinbaseTicker } from '@/services/cbp/useCoinbaseTicker';
import { useKrakenTicker } from '@/services/kraken/useKrakenTicker';

export const useTickers = () => {
	useCoinbaseTicker();
	useKrakenTicker();
};
