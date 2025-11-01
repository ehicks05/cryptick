import { BG_COLORS, BORDER_COLORS, TEXT_COLORS } from 'directionalStyles';
import { useHistoricPerformance } from 'api/useCandles';
import { aggregateCandleStats, cn, getChange } from 'lib/utils';
import React from 'react';
import { useThrottledPrice } from 'store';
import { formatPercent } from 'utils';
import { use24HourStats, useCandles } from '../../api';
import { ProductSummary } from './ProductSummary';
import Chart from './SimpleChart/Chart';

interface Props {
	productId: string;
}

const Product = ({ productId }: Props) => {
	const { data } = useCandles([productId]);
	const candles = data?.[productId].slice(0, 96) || [];
	const stats = aggregateCandleStats(candles);
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

const Performance = ({ productId }: { productId: string }) => {
	const _price = useThrottledPrice(productId);
	const cleanPriceString = _price.replace(/[$,]/g, ''); // Removes '$' and ','
	const price = Number.parseFloat(cleanPriceString);

	const { data } = useHistoricPerformance([productId]);

	const day7 = data?.day7Candles[productId][0]?.open || 0;
	const day7Change = getChange(day7, Number(price));

	const day30 = data?.day30Candles[productId][0]?.open || 0;
	const day30Change = getChange(day30, Number(price));

	const day365 = data?.day365Candles[productId][0]?.open || 0;
	const day365Change = getChange(day365, Number(price));

	const { data: stats } = use24HourStats();
	const day1 = stats?.[productId]?.open || 0;
	const day1Change = getChange(day1, Number(price));

	const changes = [
		{ ...day1Change, label: 'D' },
		{ ...day7Change, label: 'W' },
		{ ...day30Change, label: 'M' },
		{ ...day365Change, label: 'Y' },
	];

	return (
		<div className="p-4 py-2 flex justify-between items-center">
			{changes.map((change) => {
				const { direction } = change;

				return (
					<div key={change.label} className="flex items-baseline gap-1">
						<span className="text-xs text-muted-foreground">{change.label}</span>
						<span className={cn(TEXT_COLORS[direction], 'text-sm font-mono')}>
							{formatPercent(change.percentChange)}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(Product);
