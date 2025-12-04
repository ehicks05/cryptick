const baseUrl = 'https://api.binance.us';

export const client = ({ path }: { path: string }) => {
	return fetch(`${baseUrl}${path}`);
};
