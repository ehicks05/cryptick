import { CandleGranularity } from 'api/types/product';
import { useCandleGranularity } from 'hooks/useCandleGranularity';
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
	[CandleGranularity.ONE_MINUTE]: '1 minute (covers 96 minutes)',
	[CandleGranularity.FIVE_MINUTES]: '5 minute (covers 8 hours)',
	[CandleGranularity.FIFTEEN_MINUTES]: '15 minute (covers 1 day)',
	[CandleGranularity.ONE_HOUR]: '1 hour (covers 4 days)',
	[CandleGranularity.SIX_HOURS]: '6 hour (covers 24 days)',
	[CandleGranularity.ONE_DAY]: '1 day (covers 96 days)',
} as const;

const OPTIONS = Object.entries(GRANULARITY_LABELS).map(
	([value, label]) => ({ value, label }) as unknown as Option,
);

export const CandleGranularityPicker = () => {
	const [granularity, setGranularity] = useCandleGranularity();

	const handleClick = (value: CandleGranularity) => {
		if (value === granularity) return;
		setGranularity(value);
	};

	return (
		<div className="flex flex-col">
			Candle Granularity
			<div className="flex flex-col gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="">
							{GRANULARITY_LABELS[granularity]}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{OPTIONS.map(({ label, value }) => (
							<DropdownMenuItem
								key={value}
								className={value === granularity ? 'text-green-500' : ''}
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
