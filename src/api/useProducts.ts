import { useQuery } from '@tanstack/react-query';
import { PRODUCT_URL } from './constants';
import type { Product } from './types/product';
import { keyById } from './utils';

const sort = (o1: Product, o2: Product) => {
  const qc = o1.quote_currency.localeCompare(o2.quote_currency);
  if (qc !== 0) return qc;
  return o1.base_currency.localeCompare(o2.base_currency);
};

const annotate = (product: Product) => ({
  ...product,
  minimumQuoteDigits: product.quote_increment.substring(
    product.quote_increment.indexOf('.') + 1,
  ).length,
  minimumBaseDigits: product.base_increment.substring(
    product.base_increment.indexOf('.') + 1,
  ).length,
});

const getProducts = async () => {
  const response = await fetch(PRODUCT_URL);
  const data: Product[] = await response.json();
  return keyById(data.toSorted(sort).map(annotate));
};

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24,
  });
