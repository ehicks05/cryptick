import { useDocumentTitle } from '@uidotdev/usehooks';
import { useTicker } from '../api';
import { useProductIds } from './useProductIds';

export const useTitle = () => {
	const [productIds] = useProductIds();
	const { prices } = useTicker();

	const { productId, price } = prices[productIds[0]];
	useDocumentTitle(`${price} ${productId}`);
};
