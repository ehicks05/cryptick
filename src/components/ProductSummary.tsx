import React, { useState } from 'react';
import { Currency } from 'api/types/currency';
import { Product } from 'api/types/product';
import { useInterval } from 'react-use';
import { formatPercent, formatPrice } from 'utils';
import { use24HourStats, useCurrencies, useProducts } from 'api';
import { useTicker } from 'api';

// TODO: consider handling this at API level
interface AnnotatedProductStats {
	percent: number;
	isPositive: boolean;
	open: number;
	high: number;
	low: number;
	last: number;
	volume: number;
}

interface ProductSummaryProps {
	productId: string;
	dailyStats: AnnotatedProductStats;
}

const ProductSummary = ({ productId, dailyStats }: ProductSummaryProps) => {
	const productsQuery = useProducts();
	const product = productsQuery.data?.[productId];

	const currenciesQuery = useCurrencies();
	const currency = product
		? currenciesQuery.data?.[product.base_currency]
		: undefined;

	// shouldn't have to do this...
	const { data: stats } = use24HourStats();
	const lastPrice = formatPrice(
		stats?.[productId].stats_24hour.last || 0,
		product?.minimumQuoteDigits || 0,
	);

	const { prices } = useTicker();
	const price = prices[productId]?.price || lastPrice;

	if (!product || !currency || !price) {
		if (!price) console.log('missing price');
		return <pre>{JSON.stringify({ price }, null, 2)}</pre>;
	}
	return (
		<>
			<ProductName currency={currency} product={product} />
			<ProductPrice productId={productId} price={price} dailyStats={dailyStats} />
			<SecondaryStats product={product} dailyStats={dailyStats} />
		</>
	);
};

interface ProductNameProps {
	currency: Currency;
	product: Product;
}

const ProductName = ({ currency, product }: ProductNameProps) => {
	return (
		<div className="text-gray-700 dark:text-gray-400">
			<div className="flex gap-2 text-xl items-baseline">
				{product.display_name}
				<span className="text-xs">{currency.name}</span>
			</div>
		</div>
	);
};

interface ProductPriceProps {
	productId: string;
	price: string;
	dailyStats: AnnotatedProductStats;
}

const ProductPrice = ({ productId, price, dailyStats }: ProductPriceProps) => {
	const [throttledPrice, setThrottledPrice] = useState(price);

	useInterval(() => {
		setThrottledPrice(price);
	}, 1000);

	const { isPositive, percent } = dailyStats;
	const color = isPositive ? 'text-green-500' : 'text-red-500';
	return (
		<>
			<span className="text-3xl font-semibold" id={`${productId}Price`}>
				{throttledPrice}
			</span>
			<span className={`ml-2 whitespace-nowrap ${color}`}>
				{formatPercent(percent)}
			</span>
		</>
	);
};

interface SecondaryStatsProps {
	product: Product;
	dailyStats: AnnotatedProductStats;
}

const SecondaryStats = ({ product, dailyStats }: SecondaryStatsProps) => {
	const { minimumQuoteDigits } = product;
	const { low, high } = dailyStats;
	return (
		<div className="mb-4 text-xs text-gray-700 dark:text-gray-400">
			<div>
				{formatPrice(low, minimumQuoteDigits)}
				{' - '}
				{formatPrice(high, minimumQuoteDigits)}
			</div>
		</div>
	);
};

export default ProductSummary;
