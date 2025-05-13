import { useLocalStorage } from '@uidotdev/usehooks';
import { APP_NAME, DEFAULT_SELECTED_PRODUCT_IDS } from '../constants';

export const useProductIds = () => {
  return useLocalStorage(
    `${APP_NAME}-product-ids`,
    DEFAULT_SELECTED_PRODUCT_IDS,
  );
};
