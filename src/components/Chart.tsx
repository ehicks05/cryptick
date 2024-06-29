import { use24HourStats, useCandles } from 'api';
import React from 'react';
import { useMeasure } from 'react-use';

const STROKE = {
	POS: 'stroke-green-500 dark:stroke-green-500',
	NEG: 'stroke-red-400 dark:stroke-red-500',
	UND: 'stroke-neutral-500 dark:stroke-neutral-400',
};

interface ChartProps {
	productId: string;
}

const Chart = ({ productId }: ChartProps) => {
	const { data } = use24HourStats();
	const productStats = data?.[productId];

	const isPositive = productStats ? productStats.isPositive : undefined;
	const colorKey = isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';

	const [ref, { width, height }] = useMeasure<HTMLDivElement>();
	const candlesQuery = useCandles([productId]);
	const candles = candlesQuery.data?.[productId].candles;

	if (!candles || !candles.length) return <div />;

	const candleWidth = width / candles.length;

	const min = Math.min(...candles.map((c) => c[4]));
	const max = Math.max(...candles.map((c) => c[4]));

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const getX = (x: number) => width - x;

	const points = candles
		.map((candle, i) => `${getX(i * candleWidth)}, ${getY(candle[4])}`)
		.join(' ');

	return (
		<div className={'h-32'}>
			<div ref={ref} className={'w-full h-full'}>
				{width && height && (
					<svg
						viewBox={`0 0 ${width} ${height}`}
						className={`${STROKE[colorKey]} hover:brightness-90 hover:dark:brightness-110`}
					>
						<title>Chart</title>
						<polyline
							fill={'none'}
							// className={isPositive ? STROKE.POSITIVE : STROKE.NEGATIVE}
							strokeLinejoin={'round'}
							strokeWidth="1.5"
							points={points}
						/>
					</svg>
				)}
			</div>
		</div>
	);
};

export default React.memo(Chart);
