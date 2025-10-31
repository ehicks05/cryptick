import { useHistoricPerformance } from 'api/useCandles';
import clsx from 'clsx';
import { aggregateCandleStats, getChange } from 'lib/utils';
import React from 'react';
import { useThrottledPrice } from 'store';
import { use24HourStats, useCandles } from '../../api';
import Chart from '../SimpleChart/Chart';
import ProductSummary from './ProductSummary';

const BG_COLORS = {
	POS: clsx(
		'from-[rgba(60,120,60,.08)]',
		'via-[rgba(60,120,60,.08)]',
		'to-[rgba(60,120,60,.01)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(60,120,60,.15)]',
		'dark:via-[rgba(60,120,60,.1)]',
		'dark:to-[rgba(60,120,60,.1)]',
	),
	NEG: clsx(
		'from-[rgba(150,60,60,.08)]',
		'via-[rgba(150,60,60,.08)]',
		'to-[rgba(150,60,60,.01)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(150,60,60,.15)]',
		'dark:via-[rgba(150,60,60,.1)]',
		'dark:to-[rgba(150,60,60,.1)]',
	),
	UND: clsx(
		'from-[rgba(90,90,90,.15)]',
		'via-[rgba(90,90,90,.1)]',
		'to-[rgba(90,90,90,.08)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(90,90,90,.15)]',
		'dark:via-[rgba(90,90,90,.1)]',
		'dark:to-[rgba(90,90,90,.08)]',
	),
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

	return (
		<div
			className={clsx(
				'rounded-lg shadow-sm border bg-radial',
				BG_COLORS[colorKey],
				BORDER_COLORS[colorKey],
			)}
		>
			<div className="p-4 pt-2 pb-0">
				<ProductSummary productId={productId} />
			</div>
			<Chart productId={productId} />
			<Performance productId={productId} />
		</div>
	);
};

const nf = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
});

const Performance = ({ productId }: { productId: string }) => {
	const _price = useThrottledPrice(productId);
	const cleanPriceString = _price.replace(/[$,]/g, ''); // Removes '$' and ','
	const price = Number.parseFloat(cleanPriceString);

	const { data } = useHistoricPerformance([productId]);

	const day7 = data?.day7Candles[productId][0]?.open || 0;
	const day30 = data?.day30Candles[productId][0]?.open || 0;

	const day7Change = getChange(day7, Number(price));
	const day30Change = getChange(day30, Number(price));

	const { data: _stats } = use24HourStats();
	const day1 = _stats?.[productId]?.open || 0;
	const day1Change = getChange(day1, Number(price));

	const changes = [
		{ ...day1Change, label: '24H', class: '' },
		{ ...day7Change, label: '7D', class: 'justify-center' },
		{ ...day30Change, label: '30D', class: 'justify-end' },
	];

	return (
		<div className="p-4 py-2 grid grid-cols-3 justify-between items-center">
			{changes.map((change) => {
				const color = change.isPositive
					? 'text-green-700 dark:text-green-500'
					: 'text-red-600 dark:text-red-500';
				return (
					<div
						key={change.label}
						className={clsx('flex items-baseline gap-2', change.class)}
					>
						<span className="text-xs text-muted-foreground">{change.label}</span>
						<span className={clsx(change.class, color, 'text-sm font-mono')}>
							{change.isPositive ? '+' : ''}
							{nf.format(change.percentChange)}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(Product);
