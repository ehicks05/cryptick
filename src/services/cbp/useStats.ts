import { useQuery } from '@tanstack/react-query';
import { msToNextMinute } from 'lib/date';
import { get24HourStats } from './endpoints/stats';

export const use24HourStats = () =>
	useQuery({
		queryKey: ['24HourStats'],
		queryFn: get24HourStats,
		staleTime: 1000 * 60,
		refetchInterval: msToNextMinute,
	});
