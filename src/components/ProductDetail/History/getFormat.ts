const formats: Record<string, Intl.NumberFormat> = {
	DEFAULT: new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}),
};

export const getFormat = (_currency: string) => {
	// kraken uses ZUSD instead of USD
	const currency = _currency.length === 4 ? _currency.slice(1) : _currency;

	if (formats[currency]) return formats[currency];

	if (Intl.supportedValuesOf('currency').includes(currency)) {
		const newFormat = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		formats[currency] = newFormat;
		return newFormat;
	}

	return formats.DEFAULT;
};
