import { useDocumentTitle, useVisibilityChange } from '@uidotdev/usehooks';
import { useTicker } from 'api';
import { useProductIds } from './useProductIds';

export const useTitle = () => {
	const isVisible = useVisibilityChange();
	const [productIds] = useProductIds();
	const { prices } = useTicker();

	const { productId, price } = prices[productIds[0]];

	const title = `${isVisible ? '' : '[X]'} ${price} ${productId}`;
	useDocumentTitle(title);
};
