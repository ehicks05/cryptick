const normalize = (value: number) => {
	if (value < 10) return 0.03;
	if (value < 100) return 0.05;
	if (value < 1000) return 0.15;
	if (value < 2000) return 0.2;
	if (value < 4000) return 0.25;
	if (value < 8000) return 0.3;
	if (value < 16000) return 0.35;
	if (value < 32000) return 0.4;
	if (value < 64000) return 0.45;
	if (value < 128000) return 0.5;
	return 0.8;
};

export const getAlpha = (tradeSize: string, formattedPrice: string) => {
	const price = Number(formattedPrice.replaceAll(',', ''));
	const value = Number(tradeSize) * price;
	const intensity = normalize(value);
	const clampedIntensity = Math.min(Math.max(intensity, 0), 1);
	return clampedIntensity;
};