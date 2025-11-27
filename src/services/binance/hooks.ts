import { useQuery } from '@tanstack/react-query';
import { client } from './client';

export const useExchangeInfo = () =>
	useQuery({
		queryKey: ['exchangeInfo'],
		queryFn: () => client.restAPI.exchangeInfo(),
		staleTime: 1000 * 60 * 60 * 24,
	});
