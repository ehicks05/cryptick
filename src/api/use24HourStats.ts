import { PRODUCT_URL } from './constants';
import { useQuery } from '@tanstack/react-query';
import { BulkProductStats } from './types/product';

const get24HourStats = async () => {
	const stats: BulkProductStats = await (await fetch(`${PRODUCT_URL}/stats`)).json();
	return stats;
};

export const use24HourStats = () => {
	return useQuery({
		queryKey: ['24HourStats'],
		queryFn: get24HourStats,
		staleTime: 1000 * 60,
		refetchInterval: 1000 * 60,
	});
};
