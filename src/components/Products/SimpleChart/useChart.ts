import { STROKE } from 'directionalStyles';
import { useMeasure } from '@uidotdev/usehooks';
import { chunk } from 'es-toolkit';
import { mergeCandles } from 'lib/utils';
import { useState } from 'react';
import { CandleGranularity } from 'services/cbp/types/product';
import type { CryptickCandle } from 'types';
import { useLiveCandles } from '../useLiveCandles';
import { round } from './round';

/**
 * The simple chart was designed around 96 15-minute candles. Way more or fewer
 * candles looks weird. We now support more timespans including 365 1-day
 * candles. We merge them down to look better. We can't naively chunk them. Each
 * chunk must be composed of the same candles.
 */
const handleTooManyCandles = (candles: CryptickCandle[]) => {
	const mergeFactor = Math.floor(candles.length / 82);
	if (mergeFactor < 2) return candles;

	const granularity = (candles[0].timestamp - candles[1].timestamp) / 1000;

	const firstIndexFinder = (candle: CryptickCandle) => {
		const date = new Date(candle.timestamp * 1000);

		if (granularity === CandleGranularity.ONE_DAY) return date.getDay();
		if (granularity === CandleGranularity.SIX_HOURS) return date.getHours() / 6;
		if (granularity === CandleGranularity.ONE_HOUR) return date.getHours();
		if (granularity === CandleGranularity.FIFTEEN_MINUTES)
			return date.getMinutes() / 15;

		return date.getDay();
	};

	const firstMergeIndex =
		candles.findIndex((o) => firstIndexFinder(o) % mergeFactor === 0) || 0;

	const head = candles.slice(0, firstMergeIndex);
	const rest = chunk(candles.slice(firstMergeIndex), mergeFactor);
	const chunks = [...(head.length ? [head] : []), ...rest];

	const mergedCandles = chunks.map((chunk) => mergeCandles(chunk));
	return mergedCandles;
};

interface Props {
	productId: string;
}

export const useChartData = ({ productId }: Props) => {
	const [ref, { height: containerHeight, width: containerWidth }] = useMeasure();
	const { candles: _candles } = useLiveCandles({ productId });

	const candles = handleTooManyCandles(_candles);

	const [idealCandleWidth, setIdealCandleWidth] = useState(3.7);

	const step = (candles[0]?.timestamp || 0) - (candles[1]?.timestamp || 0);
	const start = candles[candles.length - 1]?.timestamp || 0;
	const end = (candles[0]?.timestamp || 0) + step;

	const height = containerHeight || 0;
	const width = containerWidth || 0;

	const min = Math.min(...candles.map((c) => c.close));
	const max = Math.max(...candles.map((c) => c.close));

	const getX = (timestamp: number) => {
		const range = end - start;
		const delta = timestamp - start;
		const fraction = (delta / range) * width;
		return round(fraction, 4);
	};

	const getY = (y: number) => {
		const range = max - min;
		const delta = y - min;
		const fraction = height - (delta / range) * height;
		return round(fraction, 4);
	};

	const stats = mergeCandles(candles);
	const { direction } = stats;
	const strokeColor = STROKE[direction];

	const points =
		candles.length !== 0
			? [
					// manually insert a point for the closing price of the latest candle
					`${getX(candles[0].timestamp + step)}, ${getY(candles[0].close)}`,
					// use every candle's opening price
					...candles.map(
						(candle) => `${getX(candle.timestamp)}, ${getY(candle.open)}`,
					),
				]
			: [];

	return {
		points: points.join(' '),
		direction,
		strokeColor,
		ref,
		height,
		width,
		idealCandleWidth,
		setIdealCandleWidth,
	};
};
