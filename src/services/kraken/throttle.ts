import pThrottle from 'p-throttle';

export const throttle = pThrottle({
	limit: 5,
	interval: 1000,
});
