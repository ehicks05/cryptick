import { useMeasure } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';
import { usePrice } from 'store';
import type { Candle as ICandle } from '../../api/types/product';
import { clamp } from '../../utils';
import Candle from './Candle';
import { Crosshair } from './Crosshair';
import { HorizontalLines } from './HorizontalLines';
import { VerticalLines } from './VerticalLines';

interface CandleChartProps {
	height: number;
	candles: ICandle[];
	productId: string;
}

const CandleChart = ({ height: h, candles, productId }: CandleChartProps) => {
	const price = usePrice(productId);

	const [ref, { width: _width }] = useMeasure<HTMLDivElement>();
	const width = _width || 0;

	const [candleWidthMulti, setCandleWidthMulti] = useState(2);
	const [mousePos] = useState<{ x: number; y: number } | undefined>(undefined);
	const [dragOffset, setDragOffset] = useState(0);
	const [height, setHeight] = useState(0);

	const baseCandleWidth = 6;
	const candleWidth = baseCandleWidth * candleWidthMulti;

	useEffect(() => {
		const newHeight = Math.max(h - 56 - 48, 1);
		setHeight(newHeight);
	}, [h]);

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
	const maxVolume = Math.max(...viewableCandles.map((candle) => candle.volume));

	const handleWheel = (e: React.WheelEvent) => {
		const newMulti = candleWidthMulti + (e.deltaY < 0 ? 0.15 : -0.15);
		setCandleWidthMulti(clamp(newMulti, 0.75, 10));
	};

	const getX = (x: number) => {
		const buffer = 56; // allow for a right-side gutter for grid markers
		return width - buffer + dragOffset - x;
	};

	const getY = (y: number) => {
		const bufferedHeight = height - 16;
		return bufferedHeight - ((y - min) / (max - min)) * bufferedHeight;
	};

	if (!candles.length) return <div />;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			ref={ref}
			className="flex grow w-full h-full border"
			// onMouseMove={(e) => {
			// 	const rect = e.target.getBoundingClientRect();
			// 	const x = e.clientX - rect.left; //x position within the element.
			// 	const y = e.clientY - rect.top; //y position within the element.
			// 	// console.log({ x, y });
			// 	setMousePos({ x, y });
			// }}
			// onMouseOut={() => setMousePos(undefined)}
			// onBlur={() => setMousePos(undefined)}
		>
			{width && height && (
				// biome-ignore lint/a11y/noSvgWithoutTitle: <>
				<svg
					style={{ touchAction: 'manipulation' }}
					viewBox={`0 0 ${width} ${height}`}
					onWheel={handleWheel}
				>
					{/* <title>chart</title> */}
					<HorizontalLines
						viewableCandles={viewableCandles}
						height={height}
						width={width}
					/>
					<VerticalLines
						viewableCandles={viewableCandles}
						height={height}
						width={width}
						candleWidth={candleWidth}
						getX={getX}
					/>
					{viewableCandles.map((candle, i) => (
						<Candle
							key={candle.timestamp}
							candle={candle}
							i={i}
							height={height}
							maxVolume={maxVolume}
							candleWidth={candleWidth}
							getX={getX}
							getY={getY}
						/>
					))}
					{mousePos && (
						<Crosshair x={mousePos.x} y={mousePos.y} w={width} h={height} />
					)}
				</svg>
			)}
		</div>
	);
};

export default React.memo(CandleChart);
