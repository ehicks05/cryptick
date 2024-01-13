import _ from 'lodash';
import { useEffect } from 'react';

import { formatPrice } from './utils';
import useStore from './store';
import { use24HourStats, useCandles, useCurrencies, useProducts } from 'api';
import { useProductIds } from 'hooks';
import { useTicker } from 'api/useTicker';

const DataFetcher = () => {
	const isAppLoading = useStore((state) => state.isAppLoading);
	const setIsAppLoading = useStore((state) => state.setIsAppLoading);
	const [productIds] = useProductIds();

	const currenciesQuery = useCurrencies();
	const productsQuery = useProducts();
	const statsQuery = use24HourStats();
	const candlesQuery = useCandles(productIds);
	const { setPrices } = useTicker();

	const isLoading =
		currenciesQuery.isLoading ||
		productsQuery.isLoading ||
		statsQuery.isLoading ||
		candlesQuery.isLoading;

	useEffect(() => {
		if (isAppLoading && !isLoading) {
			// initialize prices from the 24Stats because some products
			// trade so rarely it takes a while for a price to appear
			setPrices(
				productIds.reduce((agg, curr) => {
					const price = formatPrice(
						statsQuery.data?.[curr].stats_24hour.last || 0,
						productsQuery.data?.[curr].minimumQuoteDigits || 0,
					);
					return {
						...agg,
						[curr]: { price },
					};
				}, {}),
			);

			setIsAppLoading(false);
		}
	}, [
		isAppLoading,
		isLoading,
		statsQuery,
		productsQuery,
		productIds,
		setIsAppLoading,
		setPrices,
	]);

	return null;
};

export default DataFetcher;
