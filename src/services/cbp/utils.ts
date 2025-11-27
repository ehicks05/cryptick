// used to align refetches to be just after the start of each new minute
export const msToNextMinute = () => (62 - new Date().getSeconds()) * 1000;

export const subSeconds = (date: Date, n: number) =>
	new Date(date.setSeconds(date.getSeconds() - n));

export const toUnixTimestamp = (date: Date) => Math.round(date.getTime() / 1000);

export const getTimeAgo = (seconds: number) => {
	const date = subSeconds(new Date(), seconds);
	return toUnixTimestamp(date);
};
