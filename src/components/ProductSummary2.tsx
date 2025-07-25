import { aggregateCandleStats } from 'lib/utils';
import { useThrottledPrice } from 'store';
import { useCandles, useCurrencies, useProducts } from '../api';
import type { Product } from '../api/types/product';
import { formatPercent, formatPrice } from '../utils';

interface ProductSummaryProps {
	productId: string;
}

const ProductSummary2 = ({ productId }: ProductSummaryProps) => {
	const productsQuery = useProducts();
	const product = productsQuery.data?.[productId];

	if (!product) {
		return '';
	}
	return (
		<div className="absolute bg-linear-to-b from-white dark:from-black via-white dark:via-black via-50% to-transparent">
			<div className="pl-2 pt-1">
				<Name product={product} />
				<div className="flex gap-2">
					{/* <Price productId={productId} /> */}
					{/* <Stats product={product} /> */}
				</div>
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

	const name = `${currency?.name ? `${currency.name} · ` : ''}${product.display_name}`;

	return (
		<div className="text-neutral-700 dark:text-neutral-400">
			<div className="flex gap-2 items-baseline">
				<span className="text-sm">{name}</span>
			</div>
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
			<span className="text-sm font-semibold" id={`${productId}Price`}>
				{price}
			</span>
		</div>
	);
};

interface StatsProps {
	product: Product;
}

const Stats = ({ product: { id, minimumQuoteDigits } }: StatsProps) => {
	const { data: candleMap } = useCandles([id]);
	const candles = candleMap?.[id].slice(0, 96) || [];
	const stats = aggregateCandleStats(candles);

	const { high = 0, low = 0, isPositive, percentChange } = stats;

	const color = isPositive ? 'text-green-500' : 'text-red-500';
	const _low = formatPrice(low, minimumQuoteDigits);
	const _high = formatPrice(high, minimumQuoteDigits);
	const range =
		low > 100 && high > 100
			? `${_low.split('.')[0]} -  ${_high.split('.')[0]}`
			: `${_low} - ${_high}`;

	return (
		<div className="flex flex-col font-mono">
			<span className="text-xs">{range}</span>
			<span className={`whitespace-nowrap text-xs ${color}`}>
				{percentChange && formatPercent(percentChange)}
			</span>
		</div>
	);
};

export default ProductSummary2;
