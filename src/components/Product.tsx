import React from 'react';
import { getPercentChange } from 'utils';
import Chart from './Chart';
import ProductSummary from './ProductSummary';
import { use24HourStats } from 'api';

const borderColor = (isPositive: boolean) =>
	isPositive
		? 'border-green-50 dark:border-green-950 hover:border-green-200 dark:hover:border-green-900'
		: 'border-red-50 dark:border-red-950 hover:border-red-200 dark:hover:border-red-900';

const background = (isPositive: boolean) =>
	`bg-gradient-to-t ${
		isPositive
			? 'to-[rgba(6,78,59,.02)] hover:to-[rgba(6,78,59,.08)] from-[rgba(6,78,59,.15)] via-[rgba(6,78,59,.10)] hover:from-[rgba(6,78,59,.25)] hover:via-[rgba(6,78,59,.25)]'
			: 'to-[rgba(153,27,27,.02)] hover:to-[rgba(153,27,27,.08)] from-[rgba(153,27,27,.15)] via-[rgba(153,27,27,.10)] hover:from-[rgba(153,27,27,.25)] hover:via-[rgba(153,27,27,.25)]'
	}`;

const Product = ({ productId }: { productId: string }) => {
	const { data } = use24HourStats();
	const productStats = data?.[productId]?.stats_24hour;

	if (!productStats) return 'loading';

	const percent = getPercentChange(productStats.open, productStats.last);
	const isPositive = percent >= 0;
	const dailyStats = {
		...productStats,
		percent,
		isPositive,
	};

	return (
		<div
			className={`p-4 rounded-lg border ${borderColor(isPositive)} ${background(
				isPositive,
			)}`}
		>
			<ProductSummary productId={productId} dailyStats={dailyStats} />
			<Chart productId={productId} isPositive={isPositive} />
		</div>
	);
};

export default React.memo(Product);
