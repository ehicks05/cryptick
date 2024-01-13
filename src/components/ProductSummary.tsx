import { Currency } from 'api/types/currency';
import { Product } from 'api/types/product';
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { formatPercent, formatPrice } from 'utils';
import useStore, { AppState } from '../store';
import { useCurrencies, useProducts } from 'api';
import { useTicker } from 'api/useTicker';

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

	if (!product || !currency) return 'loading';

	return (
		<>
			<ProductName currency={currency} product={product} />
			<ProductPrice productId={productId} dailyStats={dailyStats} />
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
	dailyStats: AnnotatedProductStats;
}

const ProductPrice = ({ productId, dailyStats }: ProductPriceProps) => {
	const { prices } = useTicker();
	const price = prices[productId].price;

	const [throttledPrice, setThrottledPrice] = useState(price || dailyStats.last);

	useInterval(() => {
		setThrottledPrice(price || dailyStats.last);
	}, 2000);

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
