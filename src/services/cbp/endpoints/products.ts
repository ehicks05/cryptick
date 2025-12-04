import type { CryptickProduct } from '../../../types';
import type { Product } from '../types/product';
import { PRODUCT_URL } from './constants';
import { keyById } from './utils';

const sort = (o1: Product, o2: Product) => {
	const qc = o1.quote_currency.localeCompare(o2.quote_currency);
	if (qc !== 0) return qc;
	return o1.base_currency.localeCompare(o2.base_currency);
};

const annotate = (product: Product): CryptickProduct => ({
	...product,
	minimumQuoteDigits: product.quote_increment.substring(
		product.quote_increment.indexOf('.') + 1,
	).length,
	minimumBaseDigits: product.base_increment.substring(
		product.base_increment.indexOf('.') + 1,
	).length,
});

export const getProducts = async () => {
	const response = await fetch(PRODUCT_URL);
	const data: Product[] = await response.json();
	return keyById(
		data
			.toSorted(sort)
			.filter((o) => o.status === 'online')
			.map(annotate),
	);
};
