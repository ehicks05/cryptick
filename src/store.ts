import create from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

export interface AppState {
	isAppLoading: boolean;
	setIsAppLoading: (data: boolean) => void;
	isShowSettings: boolean;
	setIsShowSettings: (data: boolean) => void;
	isReorderEnabled: boolean;
	setIsReorderEnabled: (data: boolean) => void;
}

const useStore = create<AppState>(
	subscribeWithSelector(
		devtools(
			persist(
				(set) => ({
					isAppLoading: true,
					setIsAppLoading: (data) => set({ isAppLoading: data }),
					isShowSettings: false,
					setIsShowSettings: (data) => set({ isShowSettings: data }),
					isReorderEnabled: false,
					setIsReorderEnabled: (data) => set({ isReorderEnabled: data }),
				}),
				{
					name: 'store',
					partialize: (state) =>
						Object.fromEntries(
							Object.entries(state).filter(([key]) =>
								['selectedProductIds'].includes(key),
							),
						),
				},
			),
		),
	),
);

export default useStore;
