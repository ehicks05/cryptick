import { useQuery } from '@tanstack/react-query';
import { getProducts } from './endpoints/products';

export const useProducts = () =>
	useQuery({
		queryKey: ['products'],
		queryFn: getProducts,
		staleTime: 1000 * 60 * 60 * 24,
	});
