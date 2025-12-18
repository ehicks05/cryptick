import { keyById } from '../../utils';
import type { Currency } from '../types/currency';
import { CURRENCY_URL } from './constants';

const sort = (o1: Currency, o2: Currency) => {
	return o1.name.localeCompare(o2.name);
};

export const getCurrencies = async () => {
	const response = await fetch(CURRENCY_URL);
	const data: Currency[] = await response.json();
	return keyById(data.toSorted(sort));
};
