import { useThrottledPrice } from 'store';
import { useCurrencies, useProducts } from '../../api';
import type { Product } from '../../api/types/product';

interface NameProps {
	product: Product;
}

const Name = ({ product }: NameProps) => {
	const currenciesQuery = useCurrencies();
	const currency = product
		? currenciesQuery.data?.[product.base_currency]
		: undefined;

	return (
		<div className="flex flex-col text-xl items-baseline leading-tight">
			{product.display_name}
			<span className="text-xs text-muted-foreground">{currency?.name}</span>
		</div>
	);
};

interface PriceProps {
	productId: string;
}

const Price = ({ productId }: PriceProps) => {
	const price = useThrottledPrice(productId);

	return (
		<div className="flex gap-2 mb-4 font-mono">
			<span className="text-xl font-semibold leading-tight" id={`${productId}Price`}>
				{price}
			</span>
		</div>
	);
};

export const ProductSummary = ({ productId }: { productId: string }) => {
	const productsQuery = useProducts();
	const product = productsQuery.data?.[productId];

	if (!product) {
		return '';
	}

	return (
		<div className="flex justify-between p-4 pt-2 pb-0">
			<Name product={product} />
			<Price productId={productId} />
		</div>
	);
};
