import pThrottle from 'p-throttle';

export const throttle = pThrottle({
	limit: 10,
	interval: 1000,
});
