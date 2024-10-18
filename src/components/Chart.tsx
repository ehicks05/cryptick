import { useChartHeight } from 'hooks/useChartHeight';
import React from 'react';
import { use24HourStats, useCandles } from '../api';

const STROKE = {
	POS: 'stroke-green-500 dark:stroke-green-500',
	NEG: 'stroke-red-400 dark:stroke-red-500',
	UND: 'stroke-neutral-500 dark:stroke-neutral-400',
};

const round = (n: number, places: number) => {
	if (places < 0 || places % 1 !== 0) return n;
	const multi = 10 ** places;
	return Math.round(n * multi) / multi;
};

interface ChartProps {
	productId: string;
}

const Chart = ({ productId }: ChartProps) => {
	const [chartHeight] = useChartHeight();
	const { data } = use24HourStats();
	const productStats = data?.[productId];

	const isPositive = productStats ? productStats.isPositive : undefined;
	const colorKey = isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';

	const candlesQuery = useCandles([productId]);
	const candles = candlesQuery.data?.[productId] || [];

	const start = candles[candles.length - 1]?.timestamp || 0;
	const end = candles[0]?.timestamp || 0;

	const height = 128;
	const width = 400;

	const min = Math.min(...candles.map((c) => c.close));
	const max = Math.max(...candles.map((c) => c.close));

	const getX = (timestamp: number) => {
		const range = end - start;
		const delta = timestamp - start;
		const fraction = (delta / range) * width;
		return round(fraction, 3);
	};

	const getY = (y: number) => {
		const fraction = height - ((y - min) / (max - min)) * height;
		return round(fraction, 3);
	};

	const _points = candles.map(
		(candle) => `${getX(candle.timestamp)}, ${getY(candle.open)}`,
	);
	const points = _points.join(' ');

	return (
		<div className={chartHeight}>
			<div className="w-full h-full">
				<svg
					width="full"
					height="full"
					className="group"
					viewBox={`0 0 ${width} ${height}`}
					preserveAspectRatio="none"
				>
					<title>Chart</title>
					<polyline
						fill="none"
						strokeLinejoin="round"
						className={`${STROKE[colorKey]} stroke-[1.5] group-hover:stroke-2 transition-all`}
						points={points}
					/>
				</svg>
			</div>
		</div>
	);
};

export default React.memo(Chart);
