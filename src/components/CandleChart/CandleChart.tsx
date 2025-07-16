import { useMeasure } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';
import { usePrice } from 'store';
import type { Candle as ICandle } from '../../api/types/product';
import { clamp } from '../../utils';
import { Crosshair } from './Crosshair';
import { HorizontalLines } from './HorizontalLines';
import { VolumeBar } from './VolumeBar';

const MMM = Intl.DateTimeFormat('en-US', { month: 'short' });
const d = Intl.DateTimeFormat('en-US', { day: 'numeric' });

const Candle = ({
	candle: { timestamp, low, high, open, close, volume },
	i,
	viewableCandles,
	height,
	width,
	min,
	max,
	maxVolume,
	candleWidth,
}: {
	candle: ICandle;
	i: number;
	viewableCandles: ICandle[];
	height: number;
	width: number;
	min: number;
	max: number;
	maxVolume: number;
	candleWidth: number;
}) => {
	const date = new Date(timestamp);
	const prevCandle =
		i < viewableCandles.length - 1 ? viewableCandles[i + 1] : undefined;
	const prevCandleDate = prevCandle && new Date(prevCandle.timestamp);
	const isDayBoundary =
		prevCandleDate && date.getDate() !== prevCandleDate.getDate();
	const isMonthBoundary =
		prevCandleDate && date.getMonth() !== prevCandleDate.getMonth();
	const volumeBarHeight = ((volume / maxVolume) * height) / 4;

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const getX = (x: number) => {
		const buffer = 56; // allow for a right-side gutter for grid markers
		return width - buffer - x;
	};

	// this controls the gap between candles, decreasing relative gap as you zoom in
	// avoids candles looking too far apart when zoomed in,
	// and too squeezed together when zoomed out
	const rectXDivisor =
		candleWidth < 6 ? 8 : candleWidth < 12 ? 6 : candleWidth < 24 ? 4 : 3;

	return (
		<React.Fragment key={timestamp}>
			<VolumeBar
				getX={getX}
				i={i}
				candleWidth={candleWidth}
				rectXDivisor={rectXDivisor}
				height={height}
				volumeBarHeight={volumeBarHeight}
				volume={volume}
			/>
			{isDayBoundary && (
				<>
					<line
						stroke={'rgba(100, 100, 100, .25)'}
						x1={getX(i * candleWidth) - candleWidth / 2}
						y1={getY(min)}
						x2={getX(i * candleWidth) - candleWidth / 2}
						y2={getY(max + 1450)} // todo: figure out
					/>
					<text
						fontSize="11"
						className="fill-neutral-500"
						x={getX(i * candleWidth + candleWidth / 2)}
						y={getY(min) + 16}
					>
						{isMonthBoundary ? MMM.format(date) : d.format(date)}
					</text>
				</>
			)}
			<rect
				// stroke={close >= open ? 'rgba(16, 185, 129)' : 'rgb(239, 68, 68)'}
				className={
					close >= open
						? 'transition-[height,y] stroke-emerald-600'
						: 'transition-[height,y] stroke-red-500'
				}
				x={getX(i * candleWidth)}
				y={getY(high)}
				width={0.1}
				height={getY(low) - getY(high)}
			/>
			{candleWidth >= 4 && (
				<rect
					className={
						close >= open
							? 'transition-[height,y] stroke-emerald-600 fill-emerald-600'
							: 'transition-[height,y] stroke-red-500 fill-red-500'
					}
					x={getX(i * candleWidth) - candleWidth / rectXDivisor}
					y={getY(Math.max(open, close))}
					width={candleWidth / (rectXDivisor / 2)}
					height={Math.abs(getY(close) - getY(open))}
				/>
			)}
		</React.Fragment>
	);
};

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
	const maxVolume = Math.max(...viewableCandles.map((candle) => candle.volume));

	const handleWheel = (e: React.WheelEvent) => {
		const newMulti = candleWidthMulti + (e.deltaY < 0 ? 0.15 : -0.15);
		setCandleWidthMulti(clamp(newMulti, 0.75, 10));
	};

	const candleEls = viewableCandles.map((candle, i) => (
		<Candle
			key={candle.timestamp}
			candle={candle}
			i={i}
			viewableCandles={viewableCandles}
			height={height}
			width={width}
			min={min}
			max={max}
			maxVolume={maxVolume}
			candleWidth={candleWidth}
		/>
	));

	return (
		<div
			ref={ref}
			className="flex grow w-full h-full border"
			// onMouseMove={(e) => {
			//   let rect = e.target.getBoundingClientRect();
			//   let x = e.clientX - rect.left; //x position within the element.
			//   let y = e.clientY - rect.top; //y position within the element.
			//   // console.log({ x, y });
			//   setMousePos({ x, y });
			// }}
			// onMouseOut={() => setMousePos(undefined)}
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
					{candleEls}
					{mousePos && (
						<Crosshair x={mousePos.x} y={mousePos.y} w={width} h={height} />
					)}
				</svg>
			)}
		</div>
	);
};

export default React.memo(CandleChart);
