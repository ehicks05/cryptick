import type {
	BulkProductStat,
	BulkProductStats,
	Stats24Hour,
} from '../types/product';
import { PRODUCT_URL } from './constants';

const annotateStat = ([productId, stat]: [string, BulkProductStat]) => {
	const stat24 = stat.stats_24hour;
	return [productId, stat24];
};

export const get24HourStats = async (): Promise<Record<string, Stats24Hour>> => {
	const response = await fetch(`${PRODUCT_URL}/stats`);
	const stats: BulkProductStats = await response.json();
	return Object.fromEntries(Object.entries(stats).map(annotateStat));
};
