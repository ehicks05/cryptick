import type { Candle } from '../../api/types/product';

const mm = Intl.DateTimeFormat('en-US', {
	timeZone: 'utc',
	hour: 'numeric',
	minute: '2-digit',
});
const hh = Intl.DateTimeFormat('en-US', { timeZone: 'utc', hour: 'numeric' });
const d = Intl.DateTimeFormat('en-US', { timeZone: 'utc', day: 'numeric' });
const MMM = Intl.DateTimeFormat('en-US', { timeZone: 'utc', month: 'short' });
const yyyy = Intl.DateTimeFormat('en-US', { timeZone: 'utc', year: 'numeric' });

interface CandleChartProps {
	height: number;
	width: number;
	viewableCandles: Candle[];
	candleWidth: number;
}

export const VerticalLines = ({
	height,
	width,
	viewableCandles,
	candleWidth,
}: CandleChartProps) => {
	const getX = (x: number) => {
		const buffer = 56; // allow for a right-side gutter for grid markers
		return width - buffer - x;
	};

	const rangeMs =
		viewableCandles[0].timestamp -
		viewableCandles[viewableCandles.length - 1].timestamp;
	const rangeMinutes = rangeMs / 1000 / 60;
	const targetGridLines = width / 70; // we want a gridline every n pixels

	const OPTIONS = [
		{ format: mm, minutes: 2 },
		{ format: mm, minutes: 5 },
		{ format: mm, minutes: 15 },
		{ format: mm, minutes: 30 },
		{ format: hh, minutes: 60 },
		{
			format: hh,
			minutes: 2 * 60, // 120
			filter: (date: Date) =>
				[0, 3, 6, 9, 12, 15, 18, 21].includes(date.getUTCHours()) &&
				date.getUTCMinutes() === 0,
		},
		{
			format: hh,
			minutes: 3 * 60, // 180
			filter: (date: Date) =>
				[0, 4, 8, 12, 16, 20].includes(date.getUTCHours()) &&
				date.getUTCMinutes() === 0,
		},
		{
			format: hh,
			minutes: 4 * 60, // 240
			filter: (date: Date) =>
				[0, 6, 12, 18, 0].includes(date.getUTCHours()) && date.getUTCMinutes() === 0,
		},
		{
			format: hh,
			minutes: 6 * 60, // 360
			filter: (date: Date) => [0, 6, 12, 18].includes(date.getUTCHours()),
		},
		{
			format: hh,
			minutes: 12 * 60, // 720
			filter: (date: Date) => [0, 12].includes(date.getUTCHours()),
		},
		{
			format: d,
			minutes: 24 * 60, // 1,440
			filter: (date: Date) => date.getUTCHours() === 0,
		},
		{
			format: d,
			minutes: 2 * 24 * 60, // 2,880
			filter: (date: Date) =>
				[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29].includes(
					date.getUTCDate(),
				) && date.getUTCHours() === 0,
		},
		{
			format: d,
			minutes: 3 * 24 * 60, // 4,320
			filter: (date: Date) =>
				[1, 4, 7, 10, 13, 16, 19, 22, 25, 28].includes(date.getUTCDate()) &&
				date.getUTCHours() === 0,
		},
		{
			format: d,
			minutes: 5 * 24 * 60, // 7,200
			filter: (date: Date) =>
				[1, 5, 9, 13, 17, 21, 25].includes(date.getUTCDate()) &&
				date.getUTCHours() === 0,
		},
		{
			format: d,
			minutes: 7 * 24 * 60, // 10,080
			filter: (date: Date) => [1, 6, 11, 16, 21, 26].includes(date.getUTCDate()),
		},
		{
			format: d,
			minutes: 30 * 24 * 60, // 43,200
			filter: (date: Date) => date.getUTCDate() === 1,
		},
		{
			format: yyyy,
			minutes: 90 * 24 * 60,
			filter: (date: Date) => date.getUTCMonth() === 0 && date.getUTCDate() === 1,
		},
		{
			format: yyyy,
			minutes: 365 * 24 * 60,
			filter: (date: Date) => date.getUTCMonth() === 0 && date.getUTCDate() === 1,
		},
	];

	let optionIndex = 0;
	while (rangeMinutes / OPTIONS[optionIndex].minutes > targetGridLines) {
		optionIndex++;
	}
	const option = OPTIONS[optionIndex];

	const lines = viewableCandles
		.map((candle, i) => {
			const date = new Date(candle.timestamp);

			const prevCandle =
				i < viewableCandles.length - 1 ? viewableCandles[i + 1] : undefined;
			const prevCandleDate = prevCandle && new Date(prevCandle.timestamp);

			const isDayBoundary =
				prevCandleDate && date.getUTCDate() !== prevCandleDate.getUTCDate();
			const isMonthBoundary =
				prevCandleDate && date.getUTCMonth() !== prevCandleDate.getUTCMonth();
			const isYearBoundary =
				prevCandleDate && date.getUTCFullYear() !== prevCandleDate.getUTCFullYear();

			const passesMinutesFilter = option.filter
				? option.filter(date)
				: (candle.timestamp / 1000 / 60) % option.minutes === 0;
			if (!passesMinutesFilter) {
				return;
			}

			const format = isYearBoundary
				? yyyy
				: isMonthBoundary
					? MMM
					: isDayBoundary
						? d
						: option.format;

			const formattedDate = format.format(date);

			return { timestamp: candle.timestamp, formattedDate, i };
		})
		.filter((line) => !!line);

	console.log({ minutes: option.minutes });

	return lines.map(({ timestamp, formattedDate, i }) => {
		return (
			<g key={timestamp} className="text-black dark:text-white">
				<line
					stroke={'rgba(100, 100, 100, .25)'}
					x1={getX(i * candleWidth) - candleWidth / 2}
					y1={-32}
					x2={getX(i * candleWidth) - candleWidth / 2}
					y2={height} // todo: figure out
				/>
				<text
					fontSize="11"
					className="fill-neutral-500"
					x={getX(i * candleWidth + candleWidth / 2 + 3 * formattedDate.length)}
					y={height + 16}
				>
					{formattedDate}
				</text>
			</g>
		);
	});
};
