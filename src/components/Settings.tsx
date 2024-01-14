import _ from 'lodash';
import React, { useState, useCallback } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import shallow from 'zustand/shallow';
import useStore from '../store';
import { useCurrencies, useProducts } from 'api';
import { useProductIds } from 'hooks';
import { buildSubscribeMessage } from 'utils';
import { useTicker } from 'api/useTicker';

const Settings = () => {
	const isShowSettings = useStore((state) => state.isShowSettings, shallow);

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

	const gridClasses =
		'grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1';

	const display = isShowSettings ? 'block' : 'hidden';

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
		<div
			className={`w-full max-w-screen-xl m-auto p-4 h-full max-h-full overflow-y-auto ${display}`}
		>
			<DndLock />
			<div className="mt-4">Quote Currency: </div>
			<div className={gridClasses}>
				{Object.values(quoteCurrencies).map((quoteCurrency) => {
					return (
						<QuoteCurrencyButton
							key={quoteCurrency}
							text={quoteCurrency}
							selected={quoteCurrency === selectedQuoteCurrency}
							onClick={() => setSelectedQuoteCurrency(quoteCurrency)}
						/>
					);
				})}
			</div>

			<div className="mt-4">Base Currency: </div>
			<div className={gridClasses}>
				{Object.values(products)
					.filter(
						(product) =>
							!selectedQuoteCurrency ||
							product.quote_currency === selectedQuoteCurrency,
					)
					.map((product) => {
						return (
							<Button
								key={product.id}
								productId={product.id}
								text={product.base_currency}
								selected={productIds.includes(product.id)}
								toggleProduct={toggleProduct}
							/>
						);
					})}
			</div>
		</div>
	);
};

const DndLock = () => {
	const isDnd = useStore(useCallback((state) => state.isReorderEnabled, []));
	const setIsDnd = useStore(useCallback((state) => state.setIsReorderEnabled, []));

	const Icon = isDnd ? FaLockOpen : FaLock;
	return (
		<div className="flex gap-2 items-baseline">
			<Icon
				className="text-xl"
				role="button"
				color="gray"
				title="Toggle Drag n Drop"
				onClick={() => setIsDnd(!isDnd)}
			/>
			<div>Toggle Drag n Drop</div>
		</div>
	);
};

interface QuoteCurrencyButtonProps {
	text: string;
	selected: boolean;
	onClick: () => void;
}

const QuoteCurrencyButton = ({
	text,
	selected,
	onClick,
}: QuoteCurrencyButtonProps) => {
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
			{text}
		</button>
	);
};

interface ButtonProps {
	productId: string;
	text: string;
	selected: boolean;
	toggleProduct: (productId: string) => void;
}

const Button = ({ productId, text, selected, toggleProduct }: ButtonProps) => {
	return (
		<button
			type="button"
			className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer 
      ${
				selected
					? 'bg-green-500 text-gray-50'
					: 'text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-800'
			}`}
			onClick={() => toggleProduct(productId)}
		>
			{text}
		</button>
	);
};

export default Settings;
