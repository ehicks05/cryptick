import { cn } from 'lib/utils';
import React from 'react';
import type { Candle as ICandle } from '../../api/types/product';
import { VolumeBar } from './VolumeBar';

interface Props {
	candle: ICandle;
	i: number;
	height: number;
	maxVolume: number;
	candleWidth: number;
	getX: (x: number) => number;
	getY: (y: number) => number;
}

const Candle = ({
	candle: { timestamp, low, high, open, close, volume },
	i,
	height,
	maxVolume,
	candleWidth,
	getX,
	getY,
}: Props) => {
	const volumeBarHeight = ((volume / maxVolume) * height) / 4;

	// decrease relative gap between candles as you zoom in to avoid candles looking
	// too far apart when zoomed in, and too squeezed together when zoomed out
	const rectXDivisor =
		candleWidth < 6 ? 7 : candleWidth < 12 ? 5 : candleWidth < 24 ? 3.8 : 3;

	const candlestickWidth = Math.min(0.5, candleWidth / 10);

	const classes =
		close >= open
			? 'stroke-emerald-600 fill-emerald-600'
			: 'stroke-red-500 fill-red-500';

	return (
		<React.Fragment key={timestamp}>
			{/* temporary hover effect */}
			<rect
				key={timestamp}
				x={getX(i * candleWidth - candleWidth / 2)}
				y={-32}
				width={candleWidth}
				height={height + 12}
				className="opacity-0 hover:opacity-5 hover:fill-neutral-400 hover:stroke-neutral-400"
			/>
			<VolumeBar
				getX={getX}
				i={i}
				candleWidth={candleWidth}
				rectXDivisor={rectXDivisor}
				height={height}
				volumeBarHeight={volumeBarHeight}
				volume={volume}
			/>
			{/* wick */}
			<rect
				className={cn(classes, { 'transition-[height,y]': i === 0 })}
				x={getX(i * candleWidth + candlestickWidth / 2)}
				y={getY(high)}
				width={candlestickWidth}
				height={getY(low) - getY(high)}
			/>
			{/* body */}
			{candleWidth >= 6 && (
				<rect
					className={cn(classes, { 'transition-[height,y]': i === 0 })}
					x={getX(i * candleWidth) - candleWidth / rectXDivisor}
					y={getY(Math.max(open, close))}
					width={candleWidth / (rectXDivisor / 2)}
					height={Math.abs(getY(close) - getY(open))}
				/>
			)}
		</React.Fragment>
	);
};

export default React.memo(Candle);
