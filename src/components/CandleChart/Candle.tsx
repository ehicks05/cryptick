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
	getY: (x: number) => number;
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
			? 'transition-[height,y] stroke-emerald-600 fill-emerald-600'
			: 'transition-[height,y] stroke-red-500 fill-red-500';

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
			{/* wick */}
			<rect
				className={classes}
				x={getX(i * candleWidth + candlestickWidth / 2)}
				y={getY(high)}
				width={candlestickWidth}
				height={getY(low) - getY(high)}
			/>
			{/* body */}
			{candleWidth >= 4 && (
				<rect
					className={classes}
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
