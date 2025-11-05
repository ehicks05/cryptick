import { useMeasure } from '@uidotdev/usehooks';
import { RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { useParams } from 'wouter';
import { use24HourStats, useCandles } from '../../api';
import CandleChart from '../CandleChart';
import { CandleGranularityPicker } from '../CandleGranularityPicker';
import { Button } from '../ui/button';
import { History } from './History';

const DEFAULT_CANDLE_WIDTH_MULTI = 1;
const DEFAULT_DRAG_OFFSET = 0;

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

	const [candleWidthMulti, setCandleWidthMulti] = useState(
		DEFAULT_CANDLE_WIDTH_MULTI,
	);
	const [dragOffsetPixels, setDragOffsetPixels] = useState(DEFAULT_DRAG_OFFSET);

	const resetView = () => {
		setCandleWidthMulti(1);
		setDragOffsetPixels(0);
	};

	if (!productId) return <div>ProductId is missing...</div>;
	if (!productStats) return <div>productStats is missing...</div>;
	if (!candles) return <div>candles is missing...</div>;

	return (
		<div ref={ref} className="h-full grow flex flex-col md:flex-row gap-4">
			<div className="grow flex flex-col">
				<div
					ref={innerRef}
					className="flex flex-wrap justify-between items-center gap-2 pb-1"
				>
					<CandleGranularityPicker />
					<Button
						onClick={resetView}
						variant="ghost"
						title="Reset View"
						disabled={
							candleWidthMulti === DEFAULT_CANDLE_WIDTH_MULTI &&
							dragOffsetPixels === DEFAULT_DRAG_OFFSET
						}
					>
						<RotateCcw />
					</Button>
				</div>
				<div className="grow">
					<CandleChart
						height={height - innerHeight - 80} // why 80?
						candles={candles}
						productId={productId}
						candleWidthMulti={candleWidthMulti}
						setCandleWidthMulti={setCandleWidthMulti}
						dragOffsetPixels={dragOffsetPixels}
						setDragOffsetPixels={setDragOffsetPixels}
					/>
				</div>
			</div>
			<div
				className="hidden md:block overflow-y-auto h-full shrink-0 border rounded"
				style={{ maxHeight: height }}
			>
				<History productId={productId} />
			</div>
		</div>
	);
};

export default React.memo(ProductDetail);
