import React from 'react';
import { Product } from 'api/types/product';
import { formatPercent, formatPrice } from 'utils';
import { use24HourStats, useCurrencies, useProducts } from 'api';
import { useTicker } from 'api';

interface ProductSummaryProps {
	productId: string;
}

const ProductSummary = ({ productId }: ProductSummaryProps) => {
	const productsQuery = useProducts();
	const product = productsQuery.data?.[productId];

	if (!product) {
		return 'loading';
	}
	return (
		<div>
			<ProductName product={product} />
			<ProductPrice productId={productId} product={product} />
		</div>
	);
};

interface ProductNameProps {
	product: Product;
}

const ProductName = ({ product }: ProductNameProps) => {
	const currenciesQuery = useCurrencies();
	const currency = product
		? currenciesQuery.data?.[product.base_currency]
		: undefined;

	return (
		<div className="text-gray-700 dark:text-gray-400">
			<div className="flex gap-2 text-xl items-baseline">
				{product.display_name}
				<span className="text-xs">{currency?.name}</span>
			</div>
		</div>
	);
};

interface ProductPriceProps {
	productId: string;
	product: Product;
}

const ProductPrice = ({ productId, product }: ProductPriceProps) => {
	const { data: stats } = use24HourStats();
	const productStats = stats?.[productId];

	const { prices } = useTicker();
	const price = prices[productId]?.price;

	const { high, low, isPositive, percentChange } = productStats || {};
	const color = isPositive ? 'text-green-500' : 'text-red-500';

	const { minimumQuoteDigits } = product;

	return (
		<div className="flex gap-2 mb-4">
			<span className="text-3xl font-semibold" id={`${productId}Price`}>
				{price}
			</span>
			<div className="flex flex-col">
				<span className="text-xs">
					{low && formatPrice(low, minimumQuoteDigits)}
					{' - '}
					{high && formatPrice(high, minimumQuoteDigits)}
				</span>
				<span className={`whitespace-nowrap text-xs ${color}`}>
					{percentChange && formatPercent(percentChange)}
				</span>
			</div>
		</div>
	);
};

export default ProductSummary;
