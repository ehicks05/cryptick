import { Currency } from 'api/types/currency';
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CURRENCY_URL } from './constants';

const getCurrencies = async () => {
	const data: Currency[] = await (await fetch(CURRENCY_URL)).json();
	return _.chain(data).sortBy(['sort_order']).keyBy('id').value();
};

export const useCurrencies = () => {
	return useQuery({
		queryKey: ['currencies'],
		queryFn: getCurrencies,
		staleTime: 1000 * 60 * 60 * 24,
	});
};
