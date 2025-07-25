import type { Candle } from '../../api/types/product';
import { BOTTOM_GUTTER_HEIGHT } from './CandleChart';
import { getHorizontalLines } from './utils';

const nf = Intl.NumberFormat();

interface Props {
	height: number;
	width: number;
	viewableCandles: Candle[];
	dragOffsetPixels: number;
	getY: (y: number) => number;
}

export const HorizontalMarkers = ({
	height,
	width,
	viewableCandles,
	dragOffsetPixels,
	getY,
}: Props) => {
	const min = Math.min(...viewableCandles.map((candle) => candle.low));
	const max = Math.max(...viewableCandles.map((candle) => candle.high));

	const lines = getHorizontalLines(height, min, max, getY);

	const rectX = width - 48 + dragOffsetPixels;
	const rectWidth = 128;

	// console.log({ dragOffsetPixels, rectX, rectWidth });

	return (
		<>
			<rect
				x={rectX}
				width={rectWidth}
				y={-16} // ??
				height={height - BOTTOM_GUTTER_HEIGHT + 16}
				className="fill-white dark:fill-black"
			/>
			{lines.map(({ value, y }) => (
				<text
					key={value}
					fontSize="11"
					className="fill-neutral-500"
					x={width - 40 + dragOffsetPixels}
					y={y + 3}
				>
					{nf.format(value)}
				</text>
			))}
		</>
	);
};
