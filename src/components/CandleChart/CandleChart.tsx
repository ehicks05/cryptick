import { useMeasure } from '@uidotdev/usehooks';
import ProductSummary2 from 'components/ProductSummary2';
import React, { useEffect, useState } from 'react';
import { usePrice } from 'store';
import type { Candle as ICandle } from '../../api/types/product';
import { clamp } from '../../utils';
import Candle from './Candle';
import { Crosshair } from './Crosshair';
import { HorizontalLines } from './HorizontalLines';
import { HorizontalMarkers } from './HorizontalMarkers';
import { VerticalLines } from './VerticalLines';

const DEFAULT_CANDLE_WIDTH = 12;
const MIN_CANDLE_WIDTH_MULTI = 0.25;
const MAX_CANDLE_WIDTH_MULTI = 5;
const CANDLE_WIDTH_MULTI_DELTA = 0.15;

export const RIGHT_GUTTER_WIDTH = 64;
export const BOTTOM_GUTTER_HEIGHT = 20;

interface CandleChartProps {
	height: number;
	candles: ICandle[];
	productId: string;
	candleWidthMulti: number;
	setCandleWidthMulti: React.Dispatch<React.SetStateAction<number>>;
	dragOffsetPixels: number;
	setDragOffsetPixels: React.Dispatch<React.SetStateAction<number>>;
}

const CandleChart = ({
	height: h,
	candles,
	productId,
	candleWidthMulti,
	setCandleWidthMulti,
	dragOffsetPixels,
	setDragOffsetPixels,
}: CandleChartProps) => {
	const price = usePrice(productId);

	const [ref, { width: _width }] = useMeasure<HTMLDivElement>();
	const width = _width || 0;

	const [mouseDown, setMouseDown] = useState(false);
	const [mousePos, setMousePos] = useState<Coord | undefined>(undefined);

	const candleWidth = DEFAULT_CANDLE_WIDTH * candleWidthMulti;

	const dragOffsetCandles = Math.round(dragOffsetPixels / candleWidth);

	const [height, setHeight] = useState(0);
	useEffect(() => {
		const newHeight = Math.max(h, 1);
		setHeight(newHeight);
	}, [h]);

	const viewableCandleCount = width / candleWidth;
	const viewableCandles = candles.slice(
		-dragOffset,
		viewableCandleCount - dragOffset + 1,
	);

	// set current candle's current price
	if (candles?.[0]?.close && price) {
		const candle = candles[0];
		const currentPrice = Number(price.replace(/,/g, ''));
		candle.close = currentPrice;
		if (currentPrice < candle.low) candle.low = currentPrice;
		if (currentPrice > candle.high) candle.high = currentPrice;
	}

	const min = Math.min(...viewableCandles.map((candle) => candle.low));
	const max = Math.max(...viewableCandles.map((candle) => candle.high));
	const maxVolume = Math.max(...viewableCandles.map((candle) => candle.volume));

	const handleWheel = (e: React.WheelEvent) => {
		if (e.deltaY !== 0) {
			const newMulti =
				candleWidthMulti +
				(e.deltaY < 0 ? CANDLE_WIDTH_MULTI_DELTA : -CANDLE_WIDTH_MULTI_DELTA);
			setCandleWidthMulti(
				clamp(newMulti, MIN_CANDLE_WIDTH_MULTI, MAX_CANDLE_WIDTH_MULTI),
			);
		}
		if (e.deltaX !== 0) {
			const newDragOffset = dragOffset + (e.deltaX < 0 ? 1 : -1);
			if (newDragOffset <= 0) {
				setDragOffset(dragOffset + (e.deltaX < 0 ? 1 : -1));
			}
		}
	};

	const getX = (x: number) => {
		const buffer = RIGHT_GUTTER_WIDTH; // reserve space for right-side grid markers
		const availableWidthFactor = (width - buffer) / width;
		return (width - x) * availableWidthFactor;
	};

	const getY = (y: number) => {
		const pushDown = 16; // prevent candles from touching the top
		const buffer = BOTTOM_GUTTER_HEIGHT; // reserve space for bottom markers
		const availableHeightFactor = (height - buffer) / height;
		const availableHeight = height * availableHeightFactor;
		return availableHeight - (availableHeight * (y - min)) / (max - min);
	};

	if (!candles.length) return <div />;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		<div
			ref={ref}
			className="relative flex grow w-full h-full border"
			// onMouseMove={(e) => {
			// 	const rect = e.target.getBoundingClientRect();
			// 	const x = e.clientX - rect.left; //x position within the element.
			// 	const y = e.clientY - rect.top - 32; //y position within the element.
			// 	// console.log({ x, y });
			// 	setMousePos({ x, y });
			// }}
			// onMouseOut={() => setMousePos(undefined)}
			// onBlur={() => setMousePos(undefined)}
		>
			{width && height && (
				<svg
					style={{ touchAction: 'manipulation' }}
					viewBox={`${candleWidth / 2 + dragOffsetPixels} 0 ${width} ${height}`}
					onWheel={handleWheel}
				>
					{/* <title>chart</title> */}
					<HorizontalLines
						viewableCandles={viewableCandles}
						height={height}
						width={width}
						dragOffsetPixels={dragOffsetPixels}
						getY={getY}
					/>
					<VerticalLines
						viewableCandles={viewableCandles}
						height={height}
						width={width}
						candleWidth={candleWidth}
						getX={getX}
						dragOffset={dragOffset}
					/>
					{candles.map((candle, i) => (
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
					<HorizontalMarkers
						viewableCandles={viewableCandles}
						height={height}
						width={width}
						dragOffsetPixels={dragOffsetPixels}
						getY={getY}
					/>
					{mousePos && (
						<Crosshair x={mousePos.x} y={mousePos.y} w={width} h={height} />
					)}
				</svg>
			)}
			<ProductSummary2 productId={productId} />
		</div>
	);
};

export default React.memo(CandleChart);
