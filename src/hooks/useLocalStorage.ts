import { useLocalStorage as useStorage } from 'usehooks-ts';
import { APP } from '../constants';

export const useLocalStorage = <T>(key: string, initialValue: T) =>
	useStorage<T>(`${APP.NAME}-${key}`, initialValue);
