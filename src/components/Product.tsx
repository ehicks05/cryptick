import { aggregateCandleStats } from 'lib/utils';
import React from 'react';
import { useCandles } from '../api';
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
}

const Product = ({ productId }: Props) => {
	const { data } = useCandles([productId]);
	const candles = data?.[productId].slice(0, 96) || [];
	const stats = aggregateCandleStats(candles);
	const { isPositive } = stats;

	const colorKey = isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';
	const colorClasses = `${BORDER_COLORS[colorKey]} ${BG_COLORS[colorKey]}`;

	return (
		<div className={`rounded-lg shadow-sm bg-linear-to-t border ${colorClasses}`}>
			<div className="p-4 pb-0">
				<ProductSummary productId={productId} />
			</div>
			<Chart productId={productId} />
		</div>
	);
};

export default React.memo(Product);
