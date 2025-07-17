import type { Candle } from '../../api/types/product';

const nf = Intl.NumberFormat();

interface CandleChartProps {
	height: number;
	width: number;
	viewableCandles: Candle[];
}

export const HorizontalLines = ({
	height,
	width,
	viewableCandles,
}: CandleChartProps) => {
	const min = Math.min(...viewableCandles.map((candle) => candle.low));
	const max = Math.max(...viewableCandles.map((candle) => candle.high));

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const getHorizontalLines = (min: number, max: number) => {
		const range = max - min;
		const targetGridLines = height / 50; // we want a gridline every 50 pixels

		let power = -4;
		let optionIndex = 0;
		const options = [1, 2.5, 5];

		while (range / (options[optionIndex] * 10 ** power) > targetGridLines) {
			if (optionIndex === options.length - 1) {
				optionIndex = 0;
				power += 1;
			} else {
				optionIndex += 1;
			}
		}
		const gridSize = options[optionIndex] * 10 ** power;

		const startingLine = gridSize * Math.ceil(min / gridSize);
		const minLine = min + range * 0.01;
		const maxLine = max - range * 0.01;

		const lines = [...new Array(50)]
			.map((_, i) => startingLine + i * gridSize)
			.filter((line) => line >= minLine && line <= maxLine); // not too close to edge
		return lines;
	};

	const horizontalLineEls = getHorizontalLines(min, max).map((line) => (
		<g key={line} className="text-black dark:text-white">
			<line
				stroke={'rgba(100, 100, 100, .22)'}
				x1={0}
				y1={getY(line)}
				x2={width}
				y2={getY(line)}
			/>
			<text
				fontSize="11"
				className="fill-neutral-500"
				x={width - 40}
				y={getY(line) + 3}
			>
				{nf.format(line)}
			</text>
		</g>
	));

	return horizontalLineEls;
};
