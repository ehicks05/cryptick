import { clsx } from 'clsx';
import { useCandleGranularity } from 'hooks/useStorage';
import { ChevronDown } from 'lucide-react';
import { CandleGranularity } from 'services/cbp/types/product';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Option {
	value: CandleGranularity;
	label: string;
}

const GRANULARITY_LABELS = {
	[CandleGranularity.ONE_MINUTE]: '1m',
	[CandleGranularity.FIFTEEN_MINUTES]: '15m',
	[CandleGranularity.ONE_DAY]: '1d',
} as const;

const OPTIONS = Object.entries(GRANULARITY_LABELS).map(
	([value, label]) => ({ value, label }) as unknown as Option,
);

const EXTRA_GRANULARITY_LABELS = {
	[CandleGranularity.FIVE_MINUTES]: '5m',
	[CandleGranularity.ONE_HOUR]: '1h',
	[CandleGranularity.SIX_HOURS]: '6h',
} as const;

const EXTRA_OPTIONS = Object.entries(EXTRA_GRANULARITY_LABELS).map(
	([value, label]) => ({ value, label }) as unknown as Option,
);

export const CandleGranularityPicker = () => {
	const { granularity, setGranularity } = useCandleGranularity();

	const handleClick = (value: CandleGranularity) => {
		if (value === granularity) return;
		setGranularity(value);
	};

	const selectedClasses =
		'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200';

	return (
		<div className="">
			<div className="flex flex-wrap">
				{OPTIONS.map(({ label, value }) => (
					<Button
						key={value}
						variant="ghost"
						size="icon"
						className={clsx('text-neutral-400', {
							[selectedClasses]: value === granularity,
						})}
						onClick={() => handleClick(value)}
					>
						{label}
					</Button>
				))}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="w-5">
							<ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{EXTRA_OPTIONS.map(({ label, value }) => (
							<DropdownMenuItem
								key={value}
								className={clsx('text-neutral-400', {
									[selectedClasses]: value === granularity,
								})}
								onClick={() => handleClick(value)}
							>
								{label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
