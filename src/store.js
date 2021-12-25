import create from 'zustand'
import { devtools, persist, subscribeWithSelector } from "zustand/middleware"

const useStore = create(subscribeWithSelector(devtools(persist(set => ({
  currencies: {},
  products: {},
  stats: {},
  candles: {},
  prices: {},
  ticker: {},
  setCurrencies: (data) => set({ currencies: data }),
  setProducts: (data) => set({ products: data }),
  setStats: (data) => set({ stats: data }),
  setCandles: (data) => set({ candles: data }),
  setPrices: (data) => set({ prices: data }),
  setTicker: (data) => set({ ticker: data }),

  // ui state?
  selectedProductIds: ['BTC-USD', 'ETH-USD'],
  setSelectedProductIds: (data) => set({ selectedProductIds: data }),
  websocketReadyState: '-1',
  setWebsocketReadyState: (data) => set({ websocketReadyState: data }),
  isAppLoading: true,
  setIsAppLoading: (data) => set({ isAppLoading: data }),

  // ui state
  isShowSettings: false,
  setIsShowSettings: (data) => set({ isShowSettings: data }),
  isReorderEnabled: false,
  setIsReorderEnabled: (data) => set({ isReorderEnabled: data }),

}), {
  name: 'store', partialize: (state) =>
    Object.fromEntries(
      Object.entries(state).filter(([key]) => ["selectedProductIds"].includes(key))
    ),
  }
))));

export default useStore;