import { useQuery } from '@tanstack/react-query';
import type { Currency } from 'services/cbp/types/currency';
import { CURRENCY_URL } from './constants';
import { keyById } from './utils';

const sort = (o1: Currency, o2: Currency) => {
	return o1.name.localeCompare(o2.name);
};

const getCurrencies = async () => {
	const response = await fetch(CURRENCY_URL);
	const data: Currency[] = await response.json();
	return keyById(data.toSorted(sort));
};

export const useCurrencies = () =>
	useQuery({
		queryKey: ['currencies'],
		queryFn: getCurrencies,
		staleTime: 1000 * 60 * 60 * 24,
	});
