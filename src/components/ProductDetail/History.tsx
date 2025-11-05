import { useThrottle } from '@uidotdev/usehooks';
import type { TickerMessage } from 'api/types/ws-types';
import { useHistoryUnit } from 'hooks/useStorage';
import { cn } from 'lib/utils';
import { useStore } from 'store';

const normalize = (value: number) => {
	if (value < 10) return 0.03;
	if (value < 100) return 0.05;
	if (value < 1000) return 0.15;
	if (value < 2000) return 0.2;
	if (value < 4000) return 0.25;
	if (value < 8000) return 0.3;
	if (value < 16000) return 0.35;
	if (value < 32000) return 0.4;
	if (value < 64000) return 0.45;
	if (value < 128000) return 0.5;
	return 0.8;
};

const getAlpha = (
	tradeSize: string,
	formattedPrice: string,
	side: 'buy' | 'sell',
) => {
	const price = Number(formattedPrice.replaceAll(',', ''));
	const value = Number(tradeSize) * price;
	const intensity = normalize(value);
	const clampedIntensity = Math.min(Math.max(intensity, 0), 1);
	// bright green seems brighter than bright red
	const colorPerception = clampedIntensity > 0.5 && side === 'buy' ? 0.7 : 1;
	return clampedIntensity * colorPerception;
};

const SIDES = {
	buy: {
		highlight: 'green-bold',
		borderColor: 'border-emerald-500',
		textColor: 'text-emerald-700 dark:text-emerald-500',
	},
	sell: {
		highlight: 'red-bold',
		borderColor: 'border-red-500',
		textColor: 'text-red-700 dark:text-red-500',
	},
};

const formats: Record<string, Intl.NumberFormat> = {};
const getFormat = (currency: string) => {
	if (formats[currency]) return formats[currency];
	const newFormat = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	formats[currency] = newFormat;
	return newFormat;
};

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
	const style = {
		backgroundColor: `rgba(${
			side === 'buy' ? '0,255,150' : '255,25,0'
		},${getAlpha(last_size, price, side)})`,
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

	const { sizeUnit, toggleSizeUnit } = useHistoryUnit();

	const [base, quote] = productId.split('-');
	const selectedSizeUnit = sizeUnit === 'base' ? base : quote;
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
