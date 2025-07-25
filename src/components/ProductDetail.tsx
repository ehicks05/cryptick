import { useMeasure } from '@uidotdev/usehooks';
import React from 'react';
import { useParams } from 'wouter';
import { use24HourStats, useCandles } from '../api';
import CandleChart from './CandleChart';
import { CandleGranularityPicker } from './CandleGranularityPicker';
import History from './History';
import ProductSummary from './ProductSummary';

const borderColor = (isPositive: boolean) =>
	isPositive
		? 'border-green-300 dark:border-green-950'
		: 'border-red-300 dark:border-red-950';

const ProductDetail = () => {
	const [ref, { height: _height }] = useMeasure<HTMLDivElement>();
	const height = _height || 0;
	const [innerRef, { height: _innerHeight }] = useMeasure<HTMLDivElement>();
	const innerHeight = _innerHeight || 0;

	const { productId } = useParams();
	const { data: _candles } = useCandles([productId || '']);
	const candles = _candles?.[productId || ''];

	const { data: stats } = use24HourStats();
	const productStats = stats?.[productId || ''];

	if (!productId) return <div>ProductId is missing...</div>;
	if (!productStats) return <div>productStats is missing...</div>;
	if (!candles) return <div>candles is missing...</div>;

	return (
		<div ref={ref} className="h-full grow flex flex-col md:flex-row gap-4 p-4">
			<div className="grow flex flex-col p-4 border rounded">
				<div ref={innerRef} className="flex flex-wrap justify-between items-center">
					<ProductSummary productId={productId} />
					<CandleGranularityPicker />
				</div>
				<div className="grow">
					<CandleChart
						height={height - innerHeight}
						candles={candles}
						productId={productId}
					/>
				</div>
			</div>
			<div
				className="hidden md:block overflow-y-hidden h-full shrink-0"
				style={{ maxHeight: height }}
			>
				<History productId={productId} />
			</div>
		</div>
	);
};

export default React.memo(ProductDetail);
