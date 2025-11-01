import { BG_COLORS, BORDER_COLORS, TEXT_COLORS } from 'directionalStyles';
import { useHistoricPerformance } from 'api/useCandles';
import { useChartTimespan } from 'hooks/useStorage';
import { cn, getChange, mergeCandles } from 'lib/utils';
import React from 'react';
import { useThrottledPrice } from 'store';
import { CHART_TIMESPANS, type ChartTimespan, type Direction } from 'types';
import { formatPercent } from 'utils';
import { ProductSummary } from './ProductSummary';
import Chart from './SimpleChart/Chart';
import { useCandlesWithLivePrice } from './SimpleChart/useChart';

interface Props {
	productId: string;
}

const Product = ({ productId }: Props) => {
	const { candles } = useCandlesWithLivePrice({ productId });
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
			<Performance productId={productId} />
		</div>
	);
};

const TimespanPerformance = ({
	change,
}: {
	change: {
		name: ChartTimespan;
		label: string;
		direction: Direction;
		percentChange: number;
	};
}) => {
	const [timespan, setTimespan] = useChartTimespan();

	return (
		<div
			key={change.label}
			className={cn('flex items-baseline gap-1', {
				'font-bold': change.name === timespan,
			})}
		>
			<span className="text-xs text-muted-foreground">{change.label}</span>
			<button
				type="button"
				onClick={() => setTimespan(change.name)}
				className={cn(
					TEXT_COLORS[change.direction],
					'text-sm font-mono cursor-pointer',
				)}
			>
				{formatPercent(change.percentChange)}
			</button>
		</div>
	);
};

const Performance = ({ productId }: { productId: string }) => {
	const _price = useThrottledPrice(productId);
	const cleanPriceString = _price.replace(/[$,]/g, ''); // Removes '$' and ','
	const price = Number.parseFloat(cleanPriceString);

	const { data } = useHistoricPerformance([productId]);

	const day1 = data?.day1Candles[productId].at(-1)?.open || 0;
	const day1Change = getChange(day1, Number(price));

	const day7 = data?.day7Candles[productId].at(-1)?.open || 0;
	const day7Change = getChange(day7, Number(price));

	const day30 = data?.day30Candles[productId].at(-1)?.open || 0;
	const day30Change = getChange(day30, Number(price));

	const day365 = data?.day365Candles[productId].at(-1)?.open || 0;
	const day365Change = getChange(day365, Number(price));

	const changes = [
		{ name: CHART_TIMESPANS['24H'], label: 'D', ...day1Change },
		{ name: CHART_TIMESPANS['7D'], label: 'W', ...day7Change },
		{ name: CHART_TIMESPANS['30D'], label: 'M', ...day30Change },
		{ name: CHART_TIMESPANS['1Y'], label: 'Y', ...day365Change },
	];

	return (
		<div className="p-4 py-2 flex justify-between items-center">
			{changes.map((change) => (
				<TimespanPerformance key={change.name} change={change} />
			))}
		</div>
	);
};

export default React.memo(Product);
