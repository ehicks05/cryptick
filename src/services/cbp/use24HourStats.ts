import { useQuery } from '@tanstack/react-query';
import { get24HourStats } from './endpoints/stats';
import { getMsToNextMinuteStart } from './utils';

export const use24HourStats = () =>
	useQuery({
		queryKey: ['24HourStats'],
		queryFn: get24HourStats,
		staleTime: 1000 * 60,
		refetchInterval: getMsToNextMinuteStart,
	});
