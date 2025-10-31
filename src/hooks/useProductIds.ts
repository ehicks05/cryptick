import { DEFAULT_SELECTED_PRODUCT_IDS } from '../constants';
import { useLocalStorage } from './useLocalStorage';

export const useProductIds = () =>
	useLocalStorage('product-ids', DEFAULT_SELECTED_PRODUCT_IDS);
