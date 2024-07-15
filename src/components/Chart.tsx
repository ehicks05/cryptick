import { use24HourStats, useCandles } from 'api';
import React from 'react';

const STROKE = {
	POSITIVE: 'stroke-green-500 dark:stroke-green-500',
	NEGATIVE: 'stroke-red-400 dark:stroke-red-500',
};

interface ChartProps {
	productId: string;
}

const Chart = ({ productId }: ChartProps) => {
	const { data } = use24HourStats();
	const productStats = data?.[productId];

	const isPositive = productStats ? productStats.isPositive : undefined;

	const candlesQuery = useCandles([productId]);
	const candles = candlesQuery.data?.[productId].candles || [];

	const widthMulti = 4;
	const width = candles.length * widthMulti;
	const height = 128;

	const min = Math.min(...candles.map((c) => c[4]));
	const max = Math.max(...candles.map((c) => c[4]));

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const points = candles
		.map((candle, i) => `${width - i * widthMulti}, ${getY(candle[4])}`)
		.join(' ');

	const viewBox = `0 0 ${width} ${height}`;

	return (
		<div className={'h-32'}>
			<div className={'w-full h-full'}>
				<svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="none">
					<title>Chart</title>
					<polyline
						fill="none"
						className={isPositive ? STROKE.POSITIVE : STROKE.NEGATIVE}
						strokeLinejoin="round"
						strokeWidth="1.5"
						points={points}
					/>
				</svg>
			</div>
		</div>
	);
};

export default React.memo(Chart);
