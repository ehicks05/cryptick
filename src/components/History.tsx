import { useThrottle } from '@uidotdev/usehooks';
import { useTicker } from 'api';
import { type ComponentPropsWithoutRef, useState } from 'react';

const normalize = (value: number) => {
	if (value < 10) return 0.0;
	if (value < 100) return 0.05;
	if (value < 1000) return 0.1;
	if (value < 2000) return 0.25;
	if (value < 4000) return 0.3;
	if (value < 8000) return 0.35;
	if (value < 16000) return 0.4;
	if (value < 32000) return 0.7;
	if (value < 64000) return 0.73;
	if (value < 128000) return 0.76;
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
		borderColor: 'border-green-500',
		textColor: 'text-green-500',
	},
	sell: {
		highlight: 'red-bold',
		borderColor: 'border-red-500',
		textColor: 'text-red-500',
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

const History = ({ productId }: { productId: string }) => {
	const { ticker } = useTicker();
	const productTicker = ticker[productId] || [];
	const throttledTicker = useThrottle(productTicker, 333);

	const [sizeUnit, setSizeUnit] = useState('base');
	const toggleSizeUnit = () => setSizeUnit(sizeUnit === 'base' ? 'quote' : 'base');

	// if (!throttledTicker || throttledTicker.length === 0) return <div />;
	const [base, quote] = productId.split('-');
	const selectedSizeUnit = sizeUnit === 'base' ? base : quote;
	const format = getFormat(selectedSizeUnit);

	return (
		<div className="text-xs overflow-y-hidden">
			<table>
				<thead>
					<tr>
						<TD colSpan={4}>History</TD>
					</tr>
					<tr>
						<TD className="text-right cursor-pointer" onClick={toggleSizeUnit}>
							Trade Size
						</TD>
						<TD className="text-right">Price</TD>
						<TD className="text-right">Time</TD>
					</tr>
				</thead>
				<tbody>
					{throttledTicker.map(({ sequence, time, side, price, last_size }) => {
						const style = {
							backgroundColor: `rgba(${
								side === 'buy' ? '0,255,150' : '255,25,0'
							},${getAlpha(last_size, price, side)})`,
						};
						const tradeSize =
							sizeUnit === 'base'
								? last_size
								: format.format(
										Number(last_size) * Number(price.replaceAll(',', '')),
									);
						return (
							<TR key={sequence} className={SIDES[side].highlight}>
								<TD style={style} className="text-right">
									{tradeSize}
								</TD>
								<TD className={SIDES[side].textColor}>{price}</TD>
								<TD className="opacity-50">{time}</TD>
							</TR>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

const TR = ({ children, ...props }: ComponentPropsWithoutRef<'tr'>) => {
	return <tr {...props}>{children}</tr>;
};

const TD = ({ children, className, ...props }: ComponentPropsWithoutRef<'td'>) => {
	return (
		<td {...props} className={`px-2 ${className}`}>
			{children}
		</td>
	);
};

export default History;
