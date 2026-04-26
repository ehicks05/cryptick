import { BG_SOLIDS, TEXT_COLORS } from 'directionalStyles';
import { useChartTimespan } from 'hooks/useStorage';
import { formatPercent } from 'lib/format';
import { cn } from 'lib/utils';
import {
	type Performance,
	useHistoricPerformance,
} from 'services/useHistoricPerformance';

interface TimespanPerformanceProps {
	change: Performance;
	index: number;
}

const TimespanPerformance = ({
	change: { name, label, direction, percentChange },
	index,
}: TimespanPerformanceProps) => {
	const { timespan, setTimespan } = useChartTimespan();

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

export const Performances = ({ productId }: { productId: string }) => {
	const { performances } = useHistoricPerformance({ productId });

	return (
		<div className="flex justify-between items-center rounded-b-med">
			{performances.map((performance, i) => (
				<TimespanPerformance key={performance.name} index={i} change={performance} />
			))}
		</div>
	);
};
