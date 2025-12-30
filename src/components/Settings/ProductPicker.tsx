import { useProductIds } from '../../hooks/useStorage';
import { useExchangeInfo } from '../../services/useExchangeInfo';
import { useToggleProducts } from '../../services/useToggleProducts';
import { ComboboxDemo } from '../ui/combobox';

export const ProductPicker = () => {
	const { toggleProduct } = useToggleProducts();
	const { productIds } = useProductIds();

	const { data } = useExchangeInfo();
	const products = Object.values(data?.products || {});

	const items = products
		.map(({ id, displayName, exchange }) => ({
			label: displayName,
			value: id,
			exchange,
		}))
		.toSorted((o1, o2) => {
			const o1v = productIds.includes(o1.value) ? -1 : 1;
			const o2v = productIds.includes(o2.value) ? -1 : 1;

			return o1v - o2v;
		});

	return (
		<div className="flex flex-col">
			<div>Toggle Products</div>
			<ComboboxDemo
				items={items}
				selectedItems={productIds}
				onSelect={(value) => toggleProduct(value)}
			/>
		</div>
	);
};
