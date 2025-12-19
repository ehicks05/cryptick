const baseUrl = 'https://api.kraken.com/0/public';

export const client = ({ path, params }: { path: string; params?: string }) => {
	return fetch(`${baseUrl}${path}?${params || ''}`);
};
