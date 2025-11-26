import { useQuery } from '@tanstack/react-query';
import { getCurrencies } from './endpoints/currencies';

export const useCurrencies = () =>
	useQuery({
		queryKey: ['currencies'],
		queryFn: getCurrencies,
		staleTime: 1000 * 60 * 60 * 24,
	});
