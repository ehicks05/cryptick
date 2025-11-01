import { clsx } from 'clsx';
import { useChartTimespan } from 'hooks/useStorage';
import { CHART_TIMESPANS, type ChartTimespan } from 'types';
import { Button } from './ui/button';

interface Option {
	value: ChartTimespan;
	label: string;
}

const OPTIONS = Object.entries(CHART_TIMESPANS).map(
	([value, label]) => ({ value, label }) as Option,
);

export const ChartTimespanPicker = () => {
	const [timespan, setTimespan] = useChartTimespan();

	const handleClick = (value: ChartTimespan) => {
		if (value === timespan) return;
		setTimespan(value);
	};

	const selectedClasses =
		'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200';

	return (
		<div className="flex flex-wrap">
			{OPTIONS.map(({ label, value }) => (
				<Button
					key={value}
					variant="ghost"
					size="icon"
					className={clsx('text-neutral-400', {
						[selectedClasses]: value === timespan,
					})}
					onClick={() => handleClick(value)}
				>
					{label}
				</Button>
			))}
		</div>
	);
};
