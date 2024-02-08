import { use24HourStats, useCurrencies, useProducts } from 'api';
import { useTicker } from 'api';
import { Product } from 'api/types/product';
import React from 'react';
import { formatPercent, formatPrice } from 'utils';

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
			<Name product={product} />
			<div className="flex gap-2">
				<Price productId={productId} />
				<Stats product={product} />
			</div>
		</div>
	);
};

interface NameProps {
	product: Product;
}

const Name = ({ product }: NameProps) => {
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

interface PriceProps {
	productId: string;
}

const Price = ({ productId }: PriceProps) => {
	const { prices } = useTicker();
	const price = prices[productId]?.price;

	return (
		<div className="flex gap-2 mb-4">
			<span className="text-3xl font-semibold" id={`${productId}Price`}>
				{price}
			</span>
		</div>
	);
};

interface StatsProps {
	product: Product;
}

const Stats = ({ product: { id, minimumQuoteDigits } }: StatsProps) => {
	const { data: stats } = use24HourStats();
	const productStats = stats?.[id];

	const { high, low, isPositive, percentChange } = productStats || {};
	const color = isPositive ? 'text-green-500' : 'text-red-500';

	return (
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
	);
};

export default ProductSummary;
