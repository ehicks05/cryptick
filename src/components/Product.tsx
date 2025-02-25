import React, { type ReactNode } from 'react';
import { use24HourStats } from '../api';
import ProductSummary from './ProductSummary';
import Chart from './SimpleChart/Chart';

const BG_COLORS = {
	POS: 'from-[rgba(60,120,60,.15)] via-[rgba(90,90,90,.10)] to-[rgba(90,90,90,.08)] dark:to-[rgba(90,90,90,.08)]',
	NEG: 'from-[rgba(150,60,60,.15)] via-[rgba(90,90,90,.10)] to-[rgba(90,90,90,.08)] dark:to-[rgba(90,90,90,.08)]',
	UND: 'from-[rgba(090,90,90,.15)] via-[rgba(90,90,90,.10)] to-[rgba(90,90,90,.08)] dark:to-[rgba(90,90,90,.08)]',
} as const;

const BORDER_COLORS = {
	POS: 'border-green-200 dark:border-green-950',
	NEG: 'border-red-200 dark:border-red-950',
	UND: 'border-neutral-200 dark:border-neutral-800',
} as const;

interface Props {
	productId: string;
	handle: ReactNode;
}

const Product = ({ productId, handle }: Props) => {
	const { data } = use24HourStats();
	const productStats = data?.[productId];

	const isPositive = productStats ? productStats.isPositive : undefined;
	const colorKey = isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';
	return (
		<div
			className={`rounded-lg shadow bg-gradient-to-t border ${BORDER_COLORS[colorKey]} ${BG_COLORS[colorKey]}`}
		>
			<div className="p-4 pb-0 flex justify-between">
				<ProductSummary productId={productId} />
				{handle}
			</div>
			<Chart productId={productId} />
		</div>
	);
};

export default React.memo(Product);
