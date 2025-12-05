const baseUrl = 'https://api.binance.us';

export const client = ({ path, params }: { path: string; params?: string }) => {
  return fetch(`${baseUrl}${path}${params || ''}`);
};
