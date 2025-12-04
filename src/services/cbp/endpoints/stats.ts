import { getPercentChange } from 'lib/math';
import type {
	BulkProductStat,
	BulkProductStats,
	Stats24Hour,
} from '../types/product';
import { PRODUCT_URL } from './constants';

export interface AnnotatedProductStats extends Stats24Hour {
	percentChange: number;
	isPositive: boolean;
}

const annotateStat = ([productId, stat]: [string, BulkProductStat]) => {
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
};

export const get24HourStats = async (): Promise<
	Record<string, AnnotatedProductStats>
> => {
	const response = await fetch(`${PRODUCT_URL}/stats`);
	const stats: BulkProductStats = await response.json();
	return Object.fromEntries(Object.entries(stats).map(annotateStat));
};
