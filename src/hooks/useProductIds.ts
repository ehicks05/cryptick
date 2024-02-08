import { DEFAULT_SELECTED_PRODUCT_IDS } from 'constants';
import { useLocalStorage } from '@uidotdev/usehooks';

export const useProductIds = () => {
	return useLocalStorage('crypto-ticker-product-ids', DEFAULT_SELECTED_PRODUCT_IDS);
};
