import type { CryptickCurrency } from 'types';
import { keyById } from '../../utils';
import type { Currency } from '../types/currency';
import { CURRENCY_URL } from './constants';

const sort = (o1: Currency, o2: Currency) => {
	return o1.name.localeCompare(o2.name);
};

const toCryptickCurrency = ({ id, name }: Currency): CryptickCurrency => {
	return { id, displayName: name };
};

export const getCurrencies = async () => {
	const response = await fetch(CURRENCY_URL);
	const data: Currency[] = await response.json();
	return keyById(data.toSorted(sort).map(toCryptickCurrency));
};
