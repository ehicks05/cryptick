import { useTicker } from 'api';
import { RawCandle } from 'api/types/product';
import { format, fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useMeasure } from '@uidotdev/usehooks';
import { clamp } from 'utils';
import { Crosshair } from './Crosshair';
import { VolumeBar } from './VolumeBar';

interface CandleChartProps {
	height: number;
	candles: RawCandle[];
	productId: string;
}

const CandleChart = ({ height: h, candles, productId }: CandleChartProps) => {
	const { prices } = useTicker();
	const price = prices?.[productId].price;

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
	if (viewableCandles?.[0]?.[4] && price) {
		const candle = viewableCandles[0];
		const currentPrice = Number(price.replace(/,/g, ''));
		candle[4] = currentPrice;
		if (currentPrice < candle[1]) candle[1] = currentPrice;
		if (currentPrice > candle[2]) candle[2] = currentPrice;
	}

	const min = Math.min(...viewableCandles.map((candle) => candle[1]));
	const max = Math.max(...viewableCandles.map((candle) => candle[2]));
	const maxVolume = Math.max(...viewableCandles.map((candle) => candle[5]));

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
		// console.log(`range: ${range}`);
		// console.log(`targetGridLines: ${targetGridLines}`);
		// console.log(`gridSize: ${gridSize}`);
		// console.log(lines);
		return lines;
	};

	const horizontalLineEls = getHorizontalLines(min, max).map((line) => (
		<g key={line} className="text-black dark:text-white">
			<line
				stroke={'rgba(100, 100, 100, .25)'}
				x1={0}
				y1={getY(line)}
				x2={width}
				y2={getY(line)}
			/>
			<text fontSize="11" className="fill-current" x={width - 36} y={getY(line) + 3}>
				{line}
			</text>
		</g>
	));

	// this controls the gap between candles, decreasing relative gap as you zoom in
	// avoids candles looking too far apart when zoomed in,
	// and too squeezed together when zoomed out
	const rectXDivisor =
		candleWidth < 6 ? 8 : candleWidth < 12 ? 6 : candleWidth < 24 ? 4 : 3;

	const candleEls = viewableCandles.map(
		([datetime, low, high, open, close, vol], _i) => {
			// if (i === 0) return null;
			const i = _i + 1;
			const date = fromUnixTime(datetime);
			const prevCandle =
				_i < viewableCandles.length - 1 ? viewableCandles[_i + 1] : undefined;
			const prevCandleDate = prevCandle && fromUnixTime(prevCandle[0]);
			const isDayBoundary =
				prevCandleDate && date.getDate() !== prevCandleDate.getDate();
			const isMonthBoundary =
				prevCandleDate && date.getMonth() !== prevCandleDate.getMonth();
			const volumeBarHeight = ((vol / maxVolume) * height) / 4;

			return (
				<React.Fragment key={datetime}>
					<VolumeBar
						getX={getX}
						i={i}
						candleWidth={candleWidth}
						rectXDivisor={rectXDivisor}
						height={height}
						volumeBarHeight={volumeBarHeight}
						volume={vol}
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
								className="fill-current"
								x={getX(i * candleWidth) - 20}
								y={getY(min) + 16}
							>
								{format(date, isMonthBoundary ? 'MMM' : 'MM/dd')}
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
			className="flex flex-grow w-full h-full"
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
					{horizontalLineEls}
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
