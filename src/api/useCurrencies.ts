import { useQuery } from '@tanstack/react-query';
import type { Currency } from 'api/types/currency';
import { chain } from 'lodash-es';
import { CURRENCY_URL } from './constants';

const getCurrencies = async () => {
	const response = await fetch(CURRENCY_URL);
	const data: Currency[] = await response.json();
	return chain(data).sortBy(['sort_order']).keyBy('id').value();
};

export const useCurrencies = () => {
	return useQuery({
		queryKey: ['currencies'],
		queryFn: getCurrencies,
		staleTime: 1000 * 60 * 60 * 24,
	});
};
