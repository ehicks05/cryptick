import { useQuery } from '@tanstack/react-query';
import { getCurrencies } from './endpoints/currencies';
import { getProducts } from './endpoints/products';
import { get24HourStats } from './endpoints/stats';
import { msToNextMinute } from './utils';

export const useCurrencies = () =>
	useQuery({
		queryKey: ['currencies'],
		queryFn: getCurrencies,
		staleTime: 1000 * 60 * 60 * 24,
	});

export const useProducts = () =>
	useQuery({
		queryKey: ['products'],
		queryFn: getProducts,
		staleTime: 1000 * 60 * 60 * 24,
	});

export const use24HourStats = () =>
	useQuery({
		queryKey: ['24HourStats'],
		queryFn: get24HourStats,
		staleTime: 1000 * 60,
		refetchInterval: msToNextMinute,
	});
