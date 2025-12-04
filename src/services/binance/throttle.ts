import pThrottle from 'p-throttle';

export const throttle = pThrottle({
	limit: 20,
	interval: 1000,
});
