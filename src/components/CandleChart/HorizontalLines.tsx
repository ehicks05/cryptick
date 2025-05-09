import { useMeasure } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';
import { usePrice } from 'store';
import type { Candle } from '../../api/types/product';

interface CandleChartProps {
	height: number;
	candles: Candle[];
	productId: string;
}

const HorizontalLines = ({ height: h, candles, productId }: CandleChartProps) => {
	const price = usePrice(productId);

	const [ref, { width: _width }] = useMeasure<HTMLDivElement>();
	const width = _width || 0;

	const [candleWidthMulti] = useState(2);
	const [height, setHeight] = useState(0);

	const baseCandleWidth = 6;
	const candleWidth = baseCandleWidth * candleWidthMulti;

	useEffect(() => {
		const newHeight = Math.max(h - 56 - 48, 1);
		setHeight(newHeight);
	}, [h]);

	if (!candles.length) return <div />;

	const viewableCandleCount = width / candleWidth;
	const viewableCandles = candles.slice(0, viewableCandleCount);

	// set current candle's current price
	if (viewableCandles?.[0]?.close && price) {
		const candle = viewableCandles[0];
		const currentPrice = Number(price.replace(/,/g, ''));
		candle.close = currentPrice;
		if (currentPrice < candle.low) candle.low = currentPrice;
		if (currentPrice > candle.high) candle.high = currentPrice;
	}

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

		const minChunk = Number(min.toPrecision(2));
		const lines = [...new Array(32)].map((_, i) => minChunk + (i - 16) * gridSize);
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
				x={width - 36}
				y={getY(line) + 3}
			>
				{line}
			</text>
		</g>
	));

	return horizontalLineEls;
};

export default React.memo(HorizontalLines);
