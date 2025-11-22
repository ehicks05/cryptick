import React from 'react';
import {
	EAxisType,
	EChart2DModifierType,
	ESeriesType,
	EXyDirection,
	type IThemeProvider,
	SciChartJSDarkv2Theme,
	SciChartSurface,
} from 'scichart';
import { SciChartReact } from 'scichart-react';
import { usePrice } from 'store';
import type { Candle as ICandle } from '../../services/cbp/types/product';

interface CandleChartProps {
	candles: ICandle[];
	productId: string;
}

SciChartSurface.loadWasmFromCDN();

export class MyCustomTheme extends SciChartJSDarkv2Theme implements IThemeProvider {
	sciChartBackground = '#000000';
	gridBackgroundBrush = '#111111';
}

const SciCandleChart = ({ candles, productId }: CandleChartProps) => {
	const price = usePrice(productId);

	// set current candle's current price
	if (candles?.[0]?.close && price) {
		const candle = candles[0];
		const currentPrice = Number(price.replace(/,/g, ''));
		candle.close = currentPrice;
		if (currentPrice < candle.low) candle.low = currentPrice;
		if (currentPrice > candle.high) candle.high = currentPrice;
	}

	if (!candles.length) return <div />;

	return (
		<SciChartReact
			className="w-full h-full"
			config={{
				surface: { theme: new MyCustomTheme() },
				xAxes: [{ type: EAxisType.DateTimeNumericAxis, options: {} }],
				yAxes: [{ type: EAxisType.NumericAxis }],
				series: [
					{
						type: ESeriesType.CandlestickSeries,
						options: {
							strokeThickness: 2,
							opacity: 0.8,
							strokeUp: '#0A6',
						},
						ohlcData: {
							arrayCount: candles.length,
							xValues: candles.map((o) => o.timestamp / 1000),
							highValues: candles.map((o) => o.high),
							lowValues: candles.map((o) => o.low),
							openValues: candles.map((o) => o.open),
							closeValues: candles.map((o) => o.close),
						},
					},
				],
				modifiers: [
					{
						type: EChart2DModifierType.ZoomPan,
						options: { enableZoom: true, xyDirection: EXyDirection.XDirection },
					},
					{
						type: EChart2DModifierType.MouseWheelZoom,
						options: { xyDirection: EXyDirection.XDirection },
					},
					{ type: EChart2DModifierType.ZoomExtents, options: {} },
					{ type: EChart2DModifierType.Cursor, options: {} },
				],
			}}
		/>
	);
};

export default React.memo(SciCandleChart);
