import type { Candle } from 'services/cbp/types/product';
import { round } from './round';

/**
 * Might only useful on charts where users pick candle width, not
 * timespan...
 */
export const useIdealCandleWidth = (
	_candles: Candle[],
	containerWidth: number,
	idealCandleWidth: number,
) => {
	const _idealNumberOfCandles = containerWidth / idealCandleWidth;
	const idealNumberOfCandles = round(_idealNumberOfCandles);
	const candles =
		idealNumberOfCandles < _candles.length
			? _candles.slice(0, idealNumberOfCandles)
			: _candles;

	const debug = {
		containerWidth: round(containerWidth),
		incomingCandles: _candles.length,
		candleCount: {
			ideal: round(_idealNumberOfCandles, 2),
			result: candles.length,
		},
		candleWidth: {
			ideal: idealCandleWidth,
			result: round(containerWidth / candles.length, 3),
		},
	};

	return { idealCandles: candles, debug };
};
