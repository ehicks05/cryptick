import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';
import { buildSubscribeMessage } from 'services/cbp/utils';
import { useProductIds } from '../../hooks/useStorage';
import { useProducts } from '../../services/cbp';
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

	const items = Object.values(products)
		.map(({ id, displayName }) => ({
			label: displayName,
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
