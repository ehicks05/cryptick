export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

export const getPercentChange = (from: number, to: number) => {
	const delta = to - from;
	return delta / from;
};

export const getChange = (open: number, close: number) => {
	const percentChange = close ? close / open - 1 : 0;
	return {
		direction: percentChange === 0 ? 'UNK' : percentChange > 0 ? 'POS' : 'NEG',
		percentChange,
	} as const;
};
