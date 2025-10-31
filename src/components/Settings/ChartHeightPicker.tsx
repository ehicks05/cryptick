import { useChartHeight } from 'hooks/useChartHeight';
import { Button } from '../ui/button';

const OPTIONS = [
	{ label: '0', value: 'h-0' },
	{ label: '8', value: 'h-8' },
	{ label: '16', value: 'h-16' },
	{ label: '20', value: 'h-20' },
	{ label: '24', value: 'h-24' },
	{ label: '28', value: 'h-28' },
	{ label: '32', value: 'h-32' },
	{ label: '40', value: 'h-40' },
];

export const ChartHeightPicker = () => {
	const [chartHeight, setChartHeight] = useChartHeight();

	return (
		<div className="flex flex-col">
			Chart Height
			<div className="flex gap-2">
				{OPTIONS.map(({ label, value }) => (
					<Button
						variant="outline"
						size="icon"
						key={value}
						className={value === chartHeight ? 'text-green-500' : ''}
						onClick={() => setChartHeight(value)}
					>
						{label}
					</Button>
				))}
			</div>
		</div>
	);
};
