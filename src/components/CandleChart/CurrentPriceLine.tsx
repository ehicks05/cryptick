import clsx from 'clsx';
import { motion } from 'motion/react';
import type { Candle } from '../../api/types/product';

const nf = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 });

interface Props {
	height: number;
	width: number;
	viewableCandles: Candle[];
	getY: (y: number) => number;
}

export const CurrentPriceLine = ({
	height,
	width,
	viewableCandles,
	getY,
}: Props) => {
	const isPositive = viewableCandles[0].close >= viewableCandles[0].open;

	return (
		<g className="">
			<rect
				className={clsx(
					'transition-all',
					isPositive ? 'stroke-emerald-600' : 'stroke-red-600',
				)}
				strokeDasharray={'3'}
				x={0}
				width={width}
				y={getY(viewableCandles[0].close)}
				height={0.01}
			/>
			<rect
				className={clsx(
					'transition-all',
					isPositive ? 'fill-emerald-600' : 'fill-red-600',
				)}
				x={width - 60}
				width={60}
				y={getY(viewableCandles[0].close) - 9}
				height={16}
			/>
			<motion.text
				fontSize="10"
				className="font-mono font-bold tracking-tighter fill-white dark:fill-neutral-300 transition-all"
				x={width - 58}
				y={getY(viewableCandles[0].close) + 3}
				animate={{ attrY: getY(viewableCandles[0].close) + 3 }}
				transition={{ duration: 0.15, type: 'spring' }}
			>
				{nf.format(viewableCandles[0].close)}
			</motion.text>
		</g>
	);
};
