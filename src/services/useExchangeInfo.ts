import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { getCurrencies } from './cbp/endpoints/currencies';
import { getProducts } from './cbp/endpoints/products';
import { getAssetInfo } from './kraken/assetInfo';

export const collectExchangeInfo = async () => {
	const [_currencies, _products, assetInfo] = await Promise.all([
		getCurrencies(),
		getProducts(),
		getAssetInfo(),
	]);

	const combinedCurrencies = [
		...assetInfo.assets,
		...Object.values(_currencies), // will overwrite previous
	];

	const currencies = keyBy(combinedCurrencies, (item) => item.id);

	const combinedProducts = [...Object.values(_products), ...assetInfo.assetPairs];

	const products = keyBy(combinedProducts, (item) => item.id);

	return { currencies, products };
};

export const useExchangeInfo = () =>
	useQuery({
		queryKey: ['exchangeInfo'],
		queryFn: collectExchangeInfo,
		staleTime: 1000 * 60 * 60 * 24,
	});
