import { useMeasure } from '@uidotdev/usehooks';
import React, { useEffect, useState } from 'react';
import { usePrice } from 'store';
import type { Candle } from '../../api/types/product';
import { clamp } from '../../utils';
import { Crosshair } from './Crosshair';
import { HorizontalLines } from './HorizontalLines';
import { VolumeBar } from './VolumeBar';

const MMM = Intl.DateTimeFormat('en-US', { month: 'short' });
const MMdd = Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit' });

interface CandleChartProps {
	height: number;
	candles: Candle[];
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

	const handleWheel = (e: WheelEvent) => {
		const newMulti = candleWidthMulti * (e.deltaY < 0 ? 1.1 : 0.9);
		setCandleWidthMulti(clamp(newMulti, 0.75, 10));
	};

	const getY = (y: number) => {
		return height - ((y - min) / (max - min)) * height;
	};

	const getX = (x: number) => {
		// 32 = allow for a right-side gutter for grid markers
		return width - 36 - x;
	};

	// this controls the gap between candles, decreasing relative gap as you zoom in
	// avoids candles looking too far apart when zoomed in,
	// and too squeezed together when zoomed out
	const rectXDivisor =
		candleWidth < 6 ? 8 : candleWidth < 12 ? 6 : candleWidth < 24 ? 4 : 3;

	const candleEls = viewableCandles.map(
		({ timestamp, low, high, open, close, volume }, _i) => {
			// if (i === 0) return null;
			const i = _i + 1;
			const date = new Date(timestamp);
			const prevCandle =
				_i < viewableCandles.length - 1 ? viewableCandles[_i + 1] : undefined;
			const prevCandleDate = prevCandle && new Date(prevCandle.timestamp);
			const isDayBoundary =
				prevCandleDate && date.getDate() !== prevCandleDate.getDate();
			const isMonthBoundary =
				prevCandleDate && date.getMonth() !== prevCandleDate.getMonth();
			const volumeBarHeight = ((volume / maxVolume) * height) / 4;

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
								y2={getY(max)}
							/>
							<text
								fontSize="11"
								className="fill-neutral-500"
								x={getX(i * candleWidth) - 20}
								y={getY(min) + 16}
							>
								{isMonthBoundary ? MMM.format(date) : MMdd.format(date)}
							</text>
						</>
					)}
					<line
						stroke={close >= open ? 'rgba(16, 185, 129)' : 'rgb(239, 68, 68)'}
						x1={getX(i * candleWidth)}
						y1={getY(low)}
						x2={getX(i * candleWidth)}
						y2={getY(high)}
					/>
					{candleWidth >= 4 && (
						<rect
							stroke={close >= open ? 'rgba(16, 185, 129)' : 'rgb(239, 68, 68)'}
							fill={close >= open ? 'rgba(16, 185, 129)' : 'rgb(239, 68, 68)'}
							x={getX(i * candleWidth) - candleWidth / rectXDivisor}
							y={getY(Math.max(open, close))}
							width={candleWidth / (rectXDivisor / 2)}
							height={Math.abs(getY(close) - getY(open))}
						/>
					)}
				</React.Fragment>
			);
		},
	);

	return (
		<div
			ref={ref}
			className="flex grow w-full h-full"
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
				<svg
					style={{ touchAction: 'manipulation' }}
					viewBox={`0 0 ${width} ${height}`}
					onWheel={(e) => handleWheel(e as unknown as WheelEvent)}
				>
					<title>chart</title>
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
