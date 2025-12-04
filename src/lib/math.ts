export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

export const getPercentChange = (from: number, to: number) => {
	const delta = to - from;
	return delta / from;
};
