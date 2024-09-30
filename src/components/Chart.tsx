import { useChartHeight } from 'hooks/useChartHeight';
import React from 'react';
import { use24HourStats, useCandles } from '../api';

const STROKE = {
	POS: 'stroke-green-500 dark:stroke-green-500',
	NEG: 'stroke-red-400 dark:stroke-red-500',
	UND: 'stroke-neutral-500 dark:stroke-neutral-400',
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

	const widthMulti = 4;
	const width = candles.length * widthMulti;
	const height = 128;

	const min = Math.min(...candles.map((c) => c.close));
	const max = Math.max(...candles.map((c) => c.close));

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const points = candles
		.map((candle, i) => `${width - i * widthMulti}, ${getY(candle.close)}`)
		.join(' ');

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
