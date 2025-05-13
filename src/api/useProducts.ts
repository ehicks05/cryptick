import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { PRODUCT_URL } from './constants';
import { Product } from './types/product';

const getProducts = async () => {
  const data: Product[] = await (await fetch(PRODUCT_URL)).json();
  return _.chain(data)
    .sortBy(['quote_currency', 'base_currency'])
    .map(product => ({
      ...product,
      minimumQuoteDigits: product.quote_increment.substring(
        product.quote_increment.indexOf('.') + 1,
      ).length,
      minimumBaseDigits: product.base_increment.substring(
        product.base_increment.indexOf('.') + 1,
      ).length,
    }))
    .keyBy('id')
    .value();
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
