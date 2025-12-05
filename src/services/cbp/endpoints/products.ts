import type { CryptickProduct } from '../../../types';
import type { Product } from '../types/product';
import { PRODUCT_URL } from './constants';
import { keyById } from './utils';

const sort = (o1: Product, o2: Product) => {
	const qc = o1.quote_currency.localeCompare(o2.quote_currency);
	if (qc !== 0) return qc;
	return o1.base_currency.localeCompare(o2.base_currency);
};

const incrementToMinimumDigits = (increment: string) =>
	increment.substring(increment.indexOf('.') + 1).length;

// The number of digits to show is based on increment. An increment of .01
// results in 12.34, an increment of .001 results in 12.345, etc...
const toCryptickProduct = (product: Product): CryptickProduct => ({
	...product,
	minimumQuoteDigits: incrementToMinimumDigits(product.quote_increment),
	minimumBaseDigits: incrementToMinimumDigits(product.base_increment),
});

export const getProducts = async () => {
	const response = await fetch(PRODUCT_URL);
	const data: Product[] = await response.json();
	return keyById(
		data
			.toSorted(sort)
			.filter((o) => o.status === 'online')
			.map(toCryptickProduct),
	);
};
