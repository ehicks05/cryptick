export const getHorizontalLines = (
	height: number,
	min: number,
	max: number,
	getY: (y: number) => number,
) => {
	const range = max - min;
	const targetGridLines = height / 50; // we want a gridline every 50 pixels

	let power = -4;
	let optionIndex = 0;
	const options = [1, 2.5, 5];

	while (range / (options[optionIndex] * 10 ** power) > targetGridLines) {
		if (optionIndex === options.length - 1) {
			optionIndex = 0;
			power += 1;
		} else {
			optionIndex += 1;
		}
	}
	const gridSize = options[optionIndex] * 10 ** power;

	const startingLine = gridSize * Math.ceil(min / gridSize);
	const minLine = min + range * 0.01;
	const maxLine = max - range * 0.01;

	const lines = [...new Array(50)]
		.map((_, i) => startingLine + i * gridSize)
		.filter((line) => line >= minLine && line <= maxLine) // not too close to edge
		.map((line) => ({ value: line, y: getY(line) }));
	return lines;
};
