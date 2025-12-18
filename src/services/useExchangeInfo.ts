import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { getExchangeInfo } from 'services/binance/exchangeInfo';
import { getCurrencies } from './cbp/endpoints/currencies';
import { getProducts } from './cbp/endpoints/products';

export const collectExchangeInfo = async () => {
	const [currencies, _products, exchangeInfo] = await Promise.all([
		getCurrencies(),
		getProducts(),
		getExchangeInfo(),
	]);

	const combinedProducts = [...Object.values(_products), ...exchangeInfo.symbols];

	const products = keyBy(combinedProducts, (item) => item.id);

	return { currencies, products };
};

export const useExchangeInfo = () =>
	useQuery({
		queryKey: ['exchangeInfo'],
		queryFn: collectExchangeInfo,
		staleTime: 1000 * 60 * 60 * 24,
	});
