export const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const getPercentChange = (from: number, to: number) => {
  if (!from || !to) return 0;
	const delta = to - from;
	return delta / from;
};

export const getChange = (open: number, close: number) => {
	const percentChange = getPercentChange(open, close)
	return {
		direction: percentChange === 0 ? 'UNK' : percentChange > 0 ? 'POS' : 'NEG',
		percentChange,
	} as const;
};
