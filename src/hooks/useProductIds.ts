import { useLocalStorage } from '@uidotdev/usehooks';
import { DEFAULT_SELECTED_PRODUCT_IDS } from 'constants';

export const useProductIds = () => {
	return useLocalStorage('crypto-ticker-product-ids', DEFAULT_SELECTED_PRODUCT_IDS);
};
