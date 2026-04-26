import { BORDER_COLORS } from 'directionalStyles';
import { mergeCandles } from 'lib/candles';
import { cn } from 'lib/utils';
import React from 'react';
import { Performances } from './Performances';
import { ProductSummary } from './ProductSummary';
import Chart from './SimpleChart/Chart';
import { useLiveCandles } from './useLiveCandles';

interface Props {
	productId: string;
}

const Product = ({ productId }: Props) => {
	const { candles } = useLiveCandles({ productId });
	const { direction } = mergeCandles(candles);

	return (
		<div
			className={
				'rounded-lg shadow-sm bg-linear-to-br from-white to-white dark:from-neutral-900 dark:to-neutral-950'
			}
		>
			<div
				className={cn('border-2 border-b-0 rounded-t-lg', BORDER_COLORS[direction])}
			>
				<ProductSummary productId={productId} />
			</div>
			<div className={cn('border-x-2', BORDER_COLORS[direction])}>
				<Chart productId={productId} />
			</div>
			<Performances productId={productId} />
		</div>
	);
};

export default React.memo(Product);
