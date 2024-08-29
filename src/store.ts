import { create } from 'zustand';

export interface AppState {
	isShowSettings: boolean;
	setIsShowSettings: (data: boolean) => void;
}

const useStore = create<AppState>((set) => ({
	isShowSettings: false,
	setIsShowSettings: (data) => set({ isShowSettings: data }),
}));

export default useStore;
