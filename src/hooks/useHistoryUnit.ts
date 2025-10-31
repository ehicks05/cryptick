import { useLocalStorage } from './useLocalStorage';

export type SizeUnit = 'base' | 'quote';

export const useHistoryUnit = () => {
	const [sizeUnit, setSizeUnit] = useLocalStorage<SizeUnit>('historySizeUnit', 'base');
	const toggleSizeUnit = () => setSizeUnit(sizeUnit === 'base' ? 'quote' : 'base');

	return { sizeUnit, toggleSizeUnit };
};
