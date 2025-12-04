const priceFormats = [...Array(10)].map(
	(_i, i) => new Intl.NumberFormat('en-US', { minimumFractionDigits: i }),
);
const defaultPriceFormat = new Intl.NumberFormat('en-US');

export const formatPrice = (price: number, minimumFractionDigits: number) => {
	return (priceFormats[minimumFractionDigits] || defaultPriceFormat).format(price);
};

const defaultTimeFormat = new Intl.DateTimeFormat('en-US', {
	timeStyle: 'medium',
	hour12: false,
});

export const formatTime = (date: Date) => {
	return defaultTimeFormat.format(date);
};

const defaultPercentFormat = new Intl.NumberFormat('en-US', {
	style: 'percent',
	signDisplay: 'always',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
const smallValuePercentFormat = new Intl.NumberFormat('en-US', {
	style: 'percent',
	signDisplay: 'always',
	minimumFractionDigits: 2,
	maximumFractionDigits: 3,
});
const largeValuePercentFormat = new Intl.NumberFormat('en-US', {
	style: 'percent',
	signDisplay: 'always',
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

export const formatPercent = (percent: number) => {
	if (Math.abs(percent) < 0.0001) {
		return smallValuePercentFormat.format(percent);
	}
	if (Math.abs(percent) >= 0.1) {
		return largeValuePercentFormat.format(percent);
	}

	return defaultPercentFormat.format(percent);
};
