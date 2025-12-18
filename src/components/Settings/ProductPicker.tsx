import { useBinanceWebsocket } from 'services/binance/useBinanceWebsocket';
import { buildBinanceMessage } from 'services/binance/utils';
import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';
import { buildCoinbaseMessage } from 'services/cbp/utils';
import { useProductIds } from '../../hooks/useStorage';
import { useExchangeInfo } from '../../services/useExchangeInfo';
import { ComboboxDemo } from '../ui/combobox';

export const ProductPicker = () => {
	const { sendCoinbaseMessage } = useCoinbaseWebsocket();
	const { sendBinanceMessage } = useBinanceWebsocket();
	const { productIds, setProductIds } = useProductIds();

	const { data } = useExchangeInfo();
	const products = Object.values(data?.products || {});

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendCoinbaseMessage(buildCoinbaseMessage(isAdding, [productId]));
		sendBinanceMessage(buildBinanceMessage(isAdding, [productId]));
	};

	const items = products.map(({ id, displayName, exchange }) => ({
		label: displayName,
		value: id,
		exchange,
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
