import { Slider } from '@base-ui-components/react';
import { useChartHeight } from 'hooks/useStorage';

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
					max={40}
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
