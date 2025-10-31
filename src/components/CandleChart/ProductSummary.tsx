import { useThrottledPrice } from 'store';
import { useCurrencies, useProducts } from '../../api';

interface Props {
	productId: string;
}

export const ProductSummary = ({ productId }: Props) => {
	const productsQuery = useProducts();
	const product = productsQuery.data?.[productId];

	const currenciesQuery = useCurrencies();
	const currency = product
		? currenciesQuery.data?.[product.base_currency]
		: undefined;

	const price = useThrottledPrice(productId);

	if (!product) {
		return '';
	}

	const name = `${currency?.name ? `${currency.name} · ` : ''}${product.display_name}`;

	return (
		<div className="absolute bg-linear-to-b from-white dark:from-black via-white dark:via-black via-50% to-transparent">
			<div className="flex gap-2 items-baseline pl-2 pt-1 text-neutral-700 dark:text-neutral-400">
				<span className="text-sm">
					{name} · {price}
				</span>
			</div>
		</div>
	);
};
