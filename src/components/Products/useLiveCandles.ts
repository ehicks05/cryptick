import { useCandles } from 'services/useCandles';
import { usePrice } from 'store';

interface Props {
	productId: string;
}

/**
 * Keep the latest candle up-to-date with latest price data
 */
export const useLiveCandles = ({ productId }: Props) => {
	const candlesQuery = useCandles([productId]);
	const candles = candlesQuery.data?.[productId] || [];

	// set current candle's current price
	const price = usePrice(productId);
	if (candles[0]?.close && price) {
		const candle = candles[0];
		const currentPrice = Number(price.replace(/,/g, ''));
		if (currentPrice !== 0) {
			candle.close = currentPrice;
			if (currentPrice < candle.low) candle.low = currentPrice;
			if (currentPrice > candle.high) candle.high = currentPrice;
		}
	}

	return { candles };
};
