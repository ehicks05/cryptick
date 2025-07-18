export const keyById = <T extends { id: string }>(list: T[]) =>
	list.reduce(
		(agg, curr) => {
			agg[curr.id] = curr;
			return agg;
		},
		{} as Record<string, T>,
	);

// used to align refetches to be just after the start of each new minute
export const getMsToNextMinuteStart = () => (62 - new Date().getSeconds()) * 1000;
