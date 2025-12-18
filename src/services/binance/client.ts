const baseUrl = 'https://api.binance.us/api/v3';

export const client = ({ path, params }: { path: string; params?: string }) => {
  return fetch(`${baseUrl}${path}?${params || ''}`);
};
