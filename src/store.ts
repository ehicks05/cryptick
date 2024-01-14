import { create } from 'zustand';

export interface AppState {
	isAppLoading: boolean;
	setIsAppLoading: (data: boolean) => void;
	isShowSettings: boolean;
	setIsShowSettings: (data: boolean) => void;
	isReorderEnabled: boolean;
	setIsReorderEnabled: (data: boolean) => void;
}

const useStore = create<AppState>((set) => ({
	isAppLoading: true,
	setIsAppLoading: (data) => set({ isAppLoading: data }),
	isShowSettings: false,
	setIsShowSettings: (data) => set({ isShowSettings: data }),
	isReorderEnabled: false,
	setIsReorderEnabled: (data) => set({ isReorderEnabled: data }),
}));

export default useStore;
