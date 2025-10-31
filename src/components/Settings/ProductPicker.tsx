import { useCoinbaseWebsocket } from 'api/useCoinbaseWebsocket';
import { useProducts } from '../../api';
import { useProductIds } from '../../hooks/useStorage';
import { buildSubscribeMessage } from '../../utils';
import { ComboboxDemo } from '../ui/combobox';

export const ProductPicker = () => {
	const { sendJsonMessage } = useCoinbaseWebsocket();
	const [productIds, setProductIds] = useProductIds();
	const { data: products = {} } = useProducts();

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendJsonMessage(
			buildSubscribeMessage(isAdding ? 'subscribe' : 'unsubscribe', [productId]),
		);
	};

	const items = Object.values(products).map(({ id, display_name }) => ({
		label: display_name,
		value: id,
	}));

	return (
		<div className="flex flex-col">
			<div>Toggle Products</div>
			<ComboboxDemo
				items={items.toSorted((o1, o2) => {
					const o1v = productIds.includes(o1.value) ? -1 : 1;
					const o2v = productIds.includes(o2.value) ? -1 : 1;

					return o1v - o2v;
				})}
				selectedItems={productIds}
				onSelect={(value) => toggleProduct(value)}
			/>
		</div>
	);
};
