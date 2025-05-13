import { useQuery } from '@tanstack/react-query';
import { getPercentChange } from 'utils';
import { PRODUCT_URL } from './constants';
import type { BulkProductStats, Stats24Hour } from './types/product';

export interface AnnotatedProductStats extends Stats24Hour {
  percentChange: number;
  isPositive: boolean;
}

const get24HourStats = async (): Promise<
  Record<string, AnnotatedProductStats>
> => {
  const response = await fetch(`${PRODUCT_URL}/stats`);
  const stats: BulkProductStats = await response.json();
  return Object.fromEntries(
    Object.entries(stats).map(([productId, stat]) => {
      const stat24 = stat.stats_24hour;
      const percentChange = getPercentChange(stat24.open, stat24.last);
      const isPositive = percentChange >= 0;
      return [
        productId,
        {
          ...stat24,
          percentChange,
          isPositive,
        },
      ];
    }),
  );
};

export const use24HourStats = () =>
  useQuery({
    queryKey: ['24HourStats'],
    queryFn: get24HourStats,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
