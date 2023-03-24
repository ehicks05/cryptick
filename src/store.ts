import { Currency } from "api/currency/types";
import { BulkProductStats, DailyCandles, Product } from "api/product/types";
import { WebSocketTickerMessage } from "api/ws-types";
import { SOCKET_STATUSES } from "constants";
import create from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

export interface AppState {
  currencies: Record<string, Currency>;
  products: Record<string, Product>;
  stats: BulkProductStats;
  candles: DailyCandles;
  prices: any;
  ticker: Record<string, WebSocketTickerMessage[]>;
  setCurrencies: (data: Record<string, Currency>) => void;
  setProducts: (data: Record<string, Product>) => void;
  setStats: (data: BulkProductStats) => void;
  setCandles: (data: DailyCandles) => void;
  setPrices: (data: any) => void;
  setTicker: (data: Record<string, WebSocketTickerMessage[]>) => void;

  selectedProductIds: string[];
  setSelectedProductIds: (data: string[]) => void;
  websocketReadyState: keyof typeof SOCKET_STATUSES;
  setWebsocketReadyState: (data: keyof typeof SOCKET_STATUSES) => void;
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
          selectedProductIds: ["BTC-USD", "ETH-USD"],
          setSelectedProductIds: (data) => set({ selectedProductIds: data }),
          websocketReadyState: "-1" as keyof typeof SOCKET_STATUSES,
          setWebsocketReadyState: (data) => set({ websocketReadyState: data }),
          isAppLoading: true,
          setIsAppLoading: (data) => set({ isAppLoading: data }),

          // ui state
          isShowSettings: false,
          setIsShowSettings: (data) => set({ isShowSettings: data }),
          isReorderEnabled: false,
          setIsReorderEnabled: (data) => set({ isReorderEnabled: data }),
        }),
        {
          name: "store",
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(([key]) =>
                ["selectedProductIds"].includes(key)
              )
            ),
        }
      )
    )
  )
);

export default useStore;
