import { BG_SOLIDS, BORDER_COLORS, TEXT_COLORS } from 'directionalStyles';
import { useChartTimespan } from 'hooks/useStorage';
import { cn, mergeCandles } from 'lib/utils';
import React from 'react';
import { formatPercent } from 'utils';
import { ProductSummary } from './ProductSummary';
import Chart from './SimpleChart/Chart';
import { type Performance, useHistoricPerformance } from './useHistoricPerformance';
import { useLiveCandles } from './useLiveCandles';

interface Props {
	productId: string;
}

const Product = ({ productId }: Props) => {
	const { candles } = useLiveCandles({ productId });
	const stats = mergeCandles(candles);
	const { direction } = stats;

	const className = cn(
		'rounded-lg shadow-sm border-2 bg-radial',
		BORDER_COLORS[direction],
	);

	return (
		<div className={className}>
			<ProductSummary productId={productId} />
			<Chart productId={productId} />
			<Performances productId={productId} />
		</div>
	);
};

const TimespanPerformance = ({
	change: { name, label, direction, percentChange },
	index,
}: {
	change: Performance;
	index: number;
}) => {
	const [timespan, setTimespan] = useChartTimespan();

	return (
		<button
			key={label}
			type="button"
			onClick={() => setTimespan(name)}
			className={cn(
				'flex items-baseline gap-1 px-4 w-1/4 py-2 justify-center cursor-pointer',
				BG_SOLIDS[direction],
				{ 'rounded-bl-md': index === 0 },
				{ 'rounded-br-md': index === 3 },
			)}
		>
			<span
				className={cn('text-xs', {
					'text-muted-foreground': name !== timespan,
				})}
			>
				{label}
			</span>
			<div className={cn(TEXT_COLORS[direction], 'text-sm font-mono')}>
				{formatPercent(percentChange)}
			</div>
		</button>
	);
};

const Performances = ({ productId }: { productId: string }) => {
	const { performances } = useHistoricPerformance({ productId });

	return (
		<div className="flex justify-between items-center">
			{performances.map((performance, i) => (
				<TimespanPerformance key={performance.name} index={i} change={performance} />
			))}
		</div>
	);
};

export default React.memo(Product);
