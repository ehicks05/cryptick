import { useThrottle } from '@uidotdev/usehooks';
import { useHistorySizeUnit } from 'hooks/useStorage';
import { cn } from 'lib/utils';
import type { TickerMessage } from 'services/cbp/types/ws-types';
import { useExchangeInfo } from 'services/useExchangeInfo';
import { useStore } from 'store';
import { SIDES } from './constants';
import { getAlpha } from './getAlpha';
import { getFormat } from './getFormat';

interface TickerRowProps {
	tickerMessage: TickerMessage;
	sizeUnit: string;
	format: Intl.NumberFormat;
}

const TickerRow = ({
	tickerMessage: { side, last_size, price, sequence, time },
	sizeUnit,
	format,
}: TickerRowProps) => {
	const alpha = getAlpha(last_size, price);

	const style = {
		backgroundColor:
			side === 'buy'
				? `oklch(0.8 .29 162 / ${alpha * 100}%)`
				: `oklch(0.8 .29  30 / ${alpha * 100}%)`,
	};

	const tradeSize =
		sizeUnit === 'base'
			? last_size
			: format.format(Number(last_size) * Number(price.replaceAll(',', '')));

	const firstNonZeroIndex = tradeSize.search(/[1-9]/);
	const [faded, base] = [
		tradeSize.slice(0, firstNonZeroIndex),
		tradeSize.slice(firstNonZeroIndex),
	];

	return (
		<div
			key={sequence}
			className={cn('flex justify-between font-mono', SIDES[side].highlight)}
		>
			<div style={style} className="w-22 text-right">
				<span className="text-neutral-500 dark:text-neutral-300">{faded}</span>
				{base}
			</div>
			<div className={cn('w-16 text-right font-bold', SIDES[side].textColor)}>
				{price}
			</div>
			<div className="w-14 text-right opacity-50">{time}</div>
		</div>
	);
};

export const History = ({ productId }: { productId: string }) => {
	const ticker = useStore((state) => state.ticker[productId]) || [];
	const throttledTicker = useThrottle(ticker, 333);

	const { sizeUnit, toggleSizeUnit } = useHistorySizeUnit();

	const { data: exchangeInfo } = useExchangeInfo();

	if (!exchangeInfo) {
		return null;
	}

	const { baseAsset, quoteAsset } = exchangeInfo?.products[productId] || {};

	const selectedSizeUnit = sizeUnit === 'base' ? baseAsset : quoteAsset;
	const format = getFormat(selectedSizeUnit);

	return (
		<div className="w-64 text-xs">
			<div>History</div>
			<div className="flex justify-between text-neutral-600 dark:text-neutral-300">
				<button
					type="button"
					className="w-22 text-right cursor-pointer"
					onClick={toggleSizeUnit}
				>
					Trade Size
				</button>
				<div className="w-16 text-right">Price</div>
				<div className="w-14 text-right">Time</div>
			</div>
			{throttledTicker.map((tickerMessage) => (
				<TickerRow
					key={tickerMessage.sequence}
					tickerMessage={tickerMessage}
					sizeUnit={sizeUnit}
					format={format}
				/>
			))}
		</div>
	);
};
