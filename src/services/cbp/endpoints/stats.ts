import type { BulkProductStats } from '../types/product';
import { PRODUCT_URL } from './constants';

export const get24HourStats = async () => {
	const response = await fetch(`${PRODUCT_URL}/stats`);
	const stats: BulkProductStats = await response.json();
	return Object.fromEntries(
		Object.entries(stats).map(([productId, v]) => [`coinbase:${productId}`, v]),
	);
};
