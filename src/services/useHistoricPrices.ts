import { useQuery } from '@tanstack/react-query';
import { msToNextMinute, subSeconds, toUnixTimestamp } from 'lib/date';
import { CHART_TIMESPAN_SECONDS, EXCHANGES } from 'types';
import { getKlinesForProducts } from './binance/klines';
import { getCandlesForProducts } from './cbp/endpoints/candles';
import { CandleGranularity } from './cbp/types/product';
import { getOhlcsForProducts } from './kraken/ohlc';
import { getTradesForProducts } from './kraken/trades';
import { removeExchange } from './utils';

const getHistoricPricesForProducts = async (productIds: string[]) => {
	const WINDOW = CandleGranularity.ONE_MINUTE * 300;

	const promises = [0, ...Object.values(CHART_TIMESPAN_SECONDS)].map(
		async (seconds) => {
			const [coinbaseCandles, binanceCandles, krakenCandles] = await Promise.all([
				getCandlesForProducts({
					productIds: productIds
						.filter((p) => p.startsWith(EXCHANGES.coinbase))
						.map(removeExchange),
					granularity: CandleGranularity.ONE_MINUTE,
					start: toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW)),
					end: toUnixTimestamp(subSeconds(new Date(), seconds)),
				}),
				getKlinesForProducts({
					symbols: productIds
						.filter((p) => p.startsWith(EXCHANGES.binance))
						.map(removeExchange),
					interval: CandleGranularity.ONE_MINUTE,
					startTime: toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW)),
					endTime: toUnixTimestamp(subSeconds(new Date(), seconds)),
				}),
				seconds === 0
					? getOhlcsForProducts({
							pairs: productIds
								.filter((p) => p.startsWith(EXCHANGES.kraken))
								.map(removeExchange),
							interval: CandleGranularity.ONE_MINUTE,
							since: toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW)),
						})
					: getTradesForProducts({
							pairs: productIds
								.filter((p) => p.startsWith(EXCHANGES.kraken))
								.map(removeExchange),
							since: toUnixTimestamp(subSeconds(new Date(), seconds + WINDOW)),
							count: 1,
						}),
			]);

			return {
				...coinbaseCandles,
				...binanceCandles,
				...krakenCandles,
			};
		},
	);

	const [latestCandles, day1Candles, day7Candles, day30Candles, day365Candles] =
		await Promise.all(promises);

	return { latestCandles, day1Candles, day7Candles, day30Candles, day365Candles };
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
