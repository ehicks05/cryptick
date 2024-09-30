import { type ReactNode, useState } from 'react';
import { useCurrencies, useProducts, useTicker } from '../api';
import type { Currency } from '../api/types/currency';
import type { Product } from '../api/types/product';
import { useProductIds } from '../hooks';
import { buildSubscribeMessage } from '../utils';
import { ChartHeightPicker } from './ChartHeightPicker';

const gridClasses =
	'grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1';

interface ButtonProps {
	children: ReactNode;
	selected: boolean;
	onClick: () => void;
}

const Button = ({ children, selected, onClick }: ButtonProps) => {
	return (
		<button
			type="button"
			className={`font-mono whitespace-nowrap px-2 py-1 rounded cursor-pointer 
      ${
				selected
					? 'bg-green-500 text-gray-50'
					: 'text-neutral-800 bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-800'
			}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

const uniq = (list: string[]) => [...new Set(list)];

const getQuoteCurrencies = (
	products: Record<string, Product>,
	currencies: Record<string, Currency>,
) => {
	const quoteCurrencies = Object.values(products)
		.map((product) => product.quote_currency)
		.toSorted(
			(o1: string, o2: string) =>
				(currencies[o2].details.sort_order || 0) -
				(currencies[o1].details.sort_order || 0),
		);

	return uniq(quoteCurrencies);
};

const Settings = () => {
	const { sendJsonMessage } = useTicker();
	const { data: currencies = {} } = useCurrencies();
	const { data: products = {} } = useProducts();
	const [productIds, setProductIds] = useProductIds();

	const quoteCurrencies = getQuoteCurrencies(products, currencies);

	const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState(
		quoteCurrencies.find((qc) => qc === 'USD') || quoteCurrencies[0],
	);

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendJsonMessage(
			buildSubscribeMessage(isAdding ? 'subscribe' : 'unsubscribe', [productId]),
		);
	};

	return (
		<div className="w-full max-w-screen-xl m-auto p-4 h-full max-h-full overflow-y-auto">
			<ChartHeightPicker />
			<div className="mt-4">Quote Currency: </div>
			<div className={gridClasses}>
				{quoteCurrencies.map((quoteCurrency) => (
					<Button
						key={quoteCurrency}
						selected={quoteCurrency === selectedQuoteCurrency}
						onClick={() => setSelectedQuoteCurrency(quoteCurrency)}
					>
						{quoteCurrency}
					</Button>
				))}
			</div>

			<div className="mt-4">Base Currency: </div>
			<div className={gridClasses}>
				{Object.values(products)
					.filter((product) => product.quote_currency === selectedQuoteCurrency)
					.map((product) => (
						<Button
							key={product.id}
							selected={productIds.includes(product.id)}
							onClick={() => toggleProduct(product.id)}
						>
							{product.base_currency}
						</Button>
					))}
			</div>
		</div>
	);
};

export default Settings;
