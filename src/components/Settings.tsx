import React, { ReactNode, useState } from 'react';
import _ from 'lodash';
import { useCurrencies, useProducts, useTicker } from 'api';
import { useProductIds } from 'hooks';
import { buildSubscribeMessage } from 'utils';

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
			className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer 
      ${
				selected
					? 'bg-green-500 text-gray-50'
					: 'text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800'
			}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

const Settings = () => {
	const { sendJsonMessage } = useTicker();
	const { data: currencies } = useCurrencies();
	const { data: products } = useProducts();
	const [productIds, setProductIds] = useProductIds();

	const quoteCurrencies = _.chain(Object.values(products || {}))
		.map((product) => product.quote_currency)
		.uniq()
		.sortBy((c) => currencies?.[c].details.sort_order)
		.value();

	const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState(
		quoteCurrencies.find((qc) => qc === 'USD') || quoteCurrencies[0],
	);

	if (!currencies || !products) return 'loading';

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
