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

	const step = (candles[0]?.timestamp || 0) - (candles[1]?.timestamp || 0);
	const start = candles[candles.length - 1]?.timestamp || 0;
	const end = (candles[0]?.timestamp || 0) + step;

	const height = 128;
	const width = 400;

	const min = Math.min(...candles.map((c) => c.close));
	const max = Math.max(...candles.map((c) => c.close));

	const getX = (timestamp: number) => {
		const range = end - start;
		const delta = timestamp - start;
		const fraction = (delta / range) * width;
		return round(fraction, 4);
	};

	const getY = (y: number) => {
		const range = max - min;
		const delta = y - min;
		const fraction = height - (delta / range) * height;
		return round(fraction, 4);
	};

	const points =
		candles.length !== 0
			? [
					// manually insert a point for the closing price of the latest candle
					`${getX(candles[0].timestamp + step)}, ${getY(candles[0].close)}`,
					// use every candle's opening price
					...candles.map(
						(candle) => `${getX(candle.timestamp)}, ${getY(candle.open)}`,
					),
				]
			: [];

	return (
		<div className={chartHeight}>
			<div className="w-full h-full">
				<svg
					width="100%"
					height="100%"
					className="group"
					// add 1 unit to top and bottom to prevent points on the edge from
					// being clipped, potentially from the stroke width.
					viewBox={`0 -1 ${width} ${height + 2}`}
					preserveAspectRatio="none"
				>
					<title>Chart</title>
					<polyline
						fill="none"
						strokeLinejoin="round"
						className={`${STROKE[colorKey]} stroke-[1.5] group-hover:stroke-2 transition-all`}
						points={points.join(' ')}
					/>
				</svg>
			</div>
		</div>
	);
};

export default React.memo(Chart);
