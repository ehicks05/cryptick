export const round = (n: number, places = 0) => {
	if (places < 0 || places % 1 !== 0) return n;
	const multi = 10 ** places;
	return Math.round(n * multi) / multi;
};
