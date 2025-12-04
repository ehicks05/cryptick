import { useQuery } from '@tanstack/react-query';
import { exchangeInfo } from './exchangeInfo';

export const useExchangeInfo = () =>
	useQuery({
		queryKey: ['exchangeInfo'],
		queryFn: () => exchangeInfo(),
		staleTime: 1000 * 60 * 60 * 24,
	});
