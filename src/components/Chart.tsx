import { use24HourStats, useCandles } from 'api';
import React from 'react';

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

	const candlesQuery = useCandles([productId]);
	const candles = candlesQuery.data?.[productId].candles || [];

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
		<div className={'h-32'}>
			<div className={'w-full h-full'}>
				<svg
					width="full"
					height="full"
					className={`${STROKE[colorKey]} hover:brightness-90 hover:dark:brightness-110`}
					viewBox={`0 0 ${width} ${height}`}
					preserveAspectRatio="none"
				>
					<title>Chart</title>
					<polyline
						fill="none"
						// className={isPositive ? STROKE.POSITIVE : STROKE.NEGATIVE}
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
