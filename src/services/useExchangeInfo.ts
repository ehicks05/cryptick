import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { getExchangeInfo } from 'services/binance/exchangeInfo';
import { getCurrencies } from './cbp/endpoints/currencies';
import { getProducts } from './cbp/endpoints/products';
import { getAssetInfo } from './kraken/assetInfo';

export const collectExchangeInfo = async () => {
	const [_currencies, _products, exchangeInfo, assetInfo] = await Promise.all([
		getCurrencies(),
		getProducts(),
		getExchangeInfo(),
		getAssetInfo(),
	]);

	const combinedCurrencies = [
		...assetInfo.assets,
		...Object.values(_currencies), // will overwrite previous
	];

	const currencies = keyBy(combinedCurrencies, (item) => item.id);

	const combinedProducts = [
		...Object.values(_products),
		...exchangeInfo.symbols,
		...assetInfo.assetPairs,
	];

	const products = keyBy(combinedProducts, (item) => item.id);

	return { currencies, products };
};

export const useExchangeInfo = () =>
	useQuery({
		queryKey: ['exchangeInfo'],
		queryFn: collectExchangeInfo,
		staleTime: 1000 * 60 * 60 * 24,
	});
