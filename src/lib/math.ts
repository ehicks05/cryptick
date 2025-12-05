export const round = (n: number, places = 0) => {
	if (places < 0 || places % 1 !== 0) return n;
	const multi = 10 ** places;
	return Math.round(n * multi) / multi;
};

export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const getPercentChange = (from: number, to: number) => {
	if (!from || !to) return 0;
	const delta = to - from;
	return delta / from;
};

export const getChange = (open: number, close: number) => {
	const percentChange = getPercentChange(open, close);
	return {
		direction: percentChange === 0 ? 'UNK' : percentChange > 0 ? 'POS' : 'NEG',
		percentChange,
	} as const;
};
