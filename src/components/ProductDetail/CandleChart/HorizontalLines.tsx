import type { CryptickCandle } from 'types';
import { getHorizontalLines } from './utils';

interface Props {
	height: number;
	width: number;
	viewableCandles: CryptickCandle[];
	dragOffsetPixels: number;
	getY: (y: number) => number;
}

export const HorizontalLines = ({
	height,
	width,
	viewableCandles,
	dragOffsetPixels,
	getY,
}: Props) => {
	const min = Math.min(...viewableCandles.map((candle) => candle.low));
	const max = Math.max(...viewableCandles.map((candle) => candle.high));

	const lines = getHorizontalLines(height, min, max, getY);

	return lines.map(({ value, y }) => (
		<g key={value} className="text-black dark:text-white">
			<line
				stroke={'rgba(100, 100, 100, .22)'}
				x1={dragOffsetPixels}
				y1={y}
				x2={width}
				y2={y}
			/>
		</g>
	));
};
