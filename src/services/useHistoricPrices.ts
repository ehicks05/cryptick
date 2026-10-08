import { useQuery } from '@tanstack/react-query';
import { msToNextMinute, subSeconds, toUnixTimestamp } from '@/lib/date';
import { CHART_TIMESPAN_SECONDS, EXCHANGES } from '@/types';
import { getCandlesForProducts } from './cbp/endpoints/candles';
import { CandleGranularity } from './cbp/types/product';
import { getTradesForProducts } from './kraken/trades';
import { removeExchange } from './utils';

const getHistoricPricesForProducts = async (productIds: string[]) => {
	const WINDOW = CandleGranularity.ONE_MINUTE * 600;

	const promises = Object.values(CHART_TIMESPAN_SECONDS).map(async (seconds) => {
		const start = toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW));
		const end = toUnixTimestamp(subSeconds(new Date(), seconds));

		const [cbProductIds, krProductIds] = [
			productIds.filter((p) => p.startsWith(EXCHANGES.coinbase)).map(removeExchange),
			productIds.filter((p) => p.startsWith(EXCHANGES.kraken)).map(removeExchange),
		];

		const [coinbaseCandles, krakenCandles] = await Promise.all([
			getCandlesForProducts({
				productIds: cbProductIds,
				granularity: CandleGranularity.ONE_MINUTE,
				start,
				end,
			}),
			getTradesForProducts({ pairs: krProductIds, since: start, count: 1 }),
		]);

		return { ...coinbaseCandles, ...krakenCandles };
	});

	const [
		oneDayAgoCandles,
		oneWeekAgoCandles,
		oneMonthAgoCandles,
		oneYearAgoCandles,
	] = await Promise.all(promises);

	return {
		oneDayAgoCandles,
		oneWeekAgoCandles,
		oneMonthAgoCandles,
		oneYearAgoCandles,
	};
};

export const useHistoricPrices = (productIds: string[]) => {
	const query = useQuery({
		queryKey: ['performance', productIds],
		queryFn: () => getHistoricPricesForProducts(productIds),
		staleTime: 1000 * 60,
		refetchInterval: msToNextMinute,
	});

	return query;
};
