import { BG_COLORS, BORDER_COLORS, TEXT_COLORS } from 'directionalStyles';
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
		'rounded-lg shadow-sm border bg-radial',
		BG_COLORS[direction],
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
}: {
	change: Performance;
}) => {
	const [timespan, setTimespan] = useChartTimespan();

	return (
		<div key={label} className="flex items-baseline gap-1">
			<span
				className={cn('text-xs', {
					'text-muted-foreground': name !== timespan,
				})}
			>
				{label}
			</span>
			<button
				type="button"
				onClick={() => setTimespan(name)}
				className={cn(TEXT_COLORS[direction], 'text-sm font-mono cursor-pointer')}
			>
				{formatPercent(percentChange)}
			</button>
		</div>
	);
};

const Performances = ({ productId }: { productId: string }) => {
	const { performances } = useHistoricPerformance({ productId });

	return (
		<div className="p-4 py-2 flex justify-between items-center">
			{performances.map((performance) => (
				<TimespanPerformance key={performance.name} change={performance} />
			))}
		</div>
	);
};

export default React.memo(Product);
