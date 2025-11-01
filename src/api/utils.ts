import { CHART_TIMESPAN_SECONDS_AGO, type ChartTimespan } from 'types';
import type { Candle } from './types/product';

export const keyById = <T extends { id: string }>(list: T[]) =>
	list.reduce(
		(agg, curr) => {
			agg[curr.id] = curr;
			return agg;
		},
		{} as Record<string, T>,
	);

export const keyByProductId = <T extends { productId: string; candles: Candle[] }>(
	data: T[],
) =>
	data.reduce(
		(agg, curr) => {
			agg[curr.productId] = curr.candles;
			return agg;
		},
		{} as Record<string, T['candles']>,
	);

// used to align refetches to be just after the start of each new minute
export const getMsToNextMinuteStart = () => (62 - new Date().getSeconds()) * 1000;

export const subSeconds = (date: Date, n: number) =>
	new Date(date.setSeconds(date.getSeconds() - n));

export const toUnixTimestamp = (date: Date) => Math.round(date.getTime() / 1000);

export const getTimeAgo = (timespan: ChartTimespan) => {
	const secondsAgo = CHART_TIMESPAN_SECONDS_AGO[timespan];
	const date = subSeconds(new Date(), secondsAgo);
	const roundedDate = new Date(
		date.setMinutes(Math.floor(date.getMinutes() / 15) * 15, 0, 0),
	);
	return toUnixTimestamp(roundedDate);
};
