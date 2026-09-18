import pThrottle from 'p-throttle';

export const throttle = pThrottle({
	limit: 15,
	interval: 1000,
});
