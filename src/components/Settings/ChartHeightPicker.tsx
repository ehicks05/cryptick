import { Slider } from '@base-ui-components/react';
import { useChartHeight } from 'hooks/useStorage';

export const HEIGHTS =
	'h-0 h-4 h-8 h-12 h-16 h-20 h-24 h-28 h-32 h-36 h-40 h-44 h-48 h-52 h-56 h-60 h-64';

export const ChartHeightPicker = () => {
	const [chartHeight, setChartHeight] = useChartHeight();

	return (
		<div className="flex flex-col">
			Chart Height: {chartHeight}
			<div className="flex gap-2">
				<Slider.Root
					value={Number(chartHeight.slice(2))}
					onValueChange={(e) => setChartHeight(`h-${e}`)}
					min={0}
					max={64}
					step={4}
				>
					<Slider.Control className="flex w-56 touch-none items-center py-3 select-none">
						<Slider.Track className="h-1 w-full rounded bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200 select-none">
							<Slider.Indicator className="rounded bg-green-600 select-none" />
							<Slider.Thumb className="size-4 rounded-full bg-white outline outline-gray-300 select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-blue-800" />
						</Slider.Track>
					</Slider.Control>
				</Slider.Root>
			</div>
		</div>
	);
};
