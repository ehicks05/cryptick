import { useEffect } from "react";
import _ from "lodash";
import useWebSocket from "react-use-websocket";
import { useInterval, usePrevious } from "react-use";
import { usePageVisibility } from "react-page-visibility";

import {
  getCurrencies,
  getProducts,
  get24HourStats,
  getDailyCandles,
} from "./api";
import {
  WS_URL,
  DEFAULT_SELECTED_PRODUCT_IDS,
  SOCKET_STATUSES,
} from "./constants";
import { formatPrice, formatTime, buildSubscribeMessage } from "./utils";

import useStore from "./store";
import { WebSocketTickerMessage } from "api/ws-types";

const DataFetcher = () => {
  const setIsAppLoading = useStore((state) => state.setIsAppLoading);

  const isVisible = usePageVisibility();

  const selectedProductIds = useStore((state) => state.selectedProductIds);
  const setSelectedProductIds = useStore(
    (state) => state.setSelectedProductIds
  );

  const setCurrencies = useStore((state) => state.setCurrencies);
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);

  const setStats = useStore((state) => state.setStats);

  const candles = useStore((state) => state.candles);
  const setCandles = useStore((state) => state.setCandles);

  const prices = useStore((state) => state.prices);
  const setPrices = useStore((state) => state.setPrices);

  const ticker = useStore((state) => state.ticker);
  const setTicker = useStore((state) => state.setTicker);

  const setIsShowSettings = useStore((state) => state.setIsShowSettings);

  const setWebsocketReadyState = useStore(
    (state) => state.setWebsocketReadyState
  );

  useEffect(() => {
    const offline = "[offline] ";
    if (!isVisible) {
      document.title = `${offline}${document.title}`;
    }
    if (isVisible && document.title.includes(offline)) {
      document.title = document.title.replace(offline, "");
    }
  }, [isVisible]);

  useEffect(() => {
    setIsShowSettings(false);
    if (selectedProductIds.length === 0) {
      setSelectedProductIds(DEFAULT_SELECTED_PRODUCT_IDS);
    }

    const set = async () => {
      setIsAppLoading(true);

      const [currencies, products, stats, candles] = await Promise.all([
        getCurrencies(),
        getProducts(),
        get24HourStats(),
        getDailyCandles(selectedProductIds),
      ]);

      // initialize prices from the 24Stats because some products
      // trade so rarely it takes a while for a price to appear
      setPrices(
        selectedProductIds.reduce((agg, curr) => {
          const price = formatPrice(
            stats[curr].stats_24hour.last,
            products[curr].minimumQuoteDigits
          );
          return {
            ...agg,
            [curr]: { price },
          };
        }, {})
      );

      setProducts(products);
      setCurrencies(currencies);
      setStats(stats);
      setCandles(candles);

      setIsAppLoading(false);
    };
    set();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { sendJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      onOpen: () => {
        sendJsonMessage(buildSubscribeMessage("subscribe", selectedProductIds));
      },
      onMessage: (event) => handleMessage(JSON.parse(event.data)),
      onError: (event) => console.log(event),
      shouldReconnect: (closeEvent) => true,
      retryOnError: true,
      reconnectAttempts: 50,
      reconnectInterval: 2000,
      share: true,
    },
    isVisible
  );

  useEffect(() => {
    setWebsocketReadyState(
      readyState as unknown as keyof typeof SOCKET_STATUSES
    );
  }, [readyState, setWebsocketReadyState]);

  useInterval(() => {
    const set = async () => {
      setStats(await get24HourStats());
      setCandles(await getDailyCandles(selectedProductIds));
    };
    set();
  }, 60000);

  const prevSelectedProductIds = usePrevious(selectedProductIds);
  useEffect(() => {
    const toggleProduct = async (productId: string, isNew: boolean) => {
      sendJsonMessage(
        buildSubscribeMessage(isNew ? "subscribe" : "unsubscribe", [productId])
      );

      if (isNew) {
        const newCandles = await getDailyCandles([productId]);
        setCandles({ ...candles, ...newCandles });
      }
    };
    if (prevSelectedProductIds && selectedProductIds) {
      const productId = _.xor(prevSelectedProductIds, selectedProductIds)[0];
      const isNew = prevSelectedProductIds.indexOf(productId) === -1;
      toggleProduct(productId, isNew);
    }
  }, [selectedProductIds]);

  const handleMessage = (message: WebSocketTickerMessage) => {
    if (Object.keys(products).length === 0) return;
    if (message.type !== "ticker") return;
    const { product_id: productId, price: rawPrice } = message;

    const price = formatPrice(
      Number(rawPrice),
      products[productId].minimumQuoteDigits
    );

    setPrices({
      ...prices,
      [productId]: { price },
    });

    if (productId === selectedProductIds[0])
      document.title = `${price} ${
        products[selectedProductIds[0]].display_name
      }`;

    const { sequence, time, side, last_size } = message;
    if (!time) return;

    const newMessage = {
      productId,
      sequence,
      time: formatTime(new Date(time)),
      side,
      price,
      last_size: formatPrice(
        Number(last_size),
        products[productId].minimumBaseDigits
      ),
    };
    setTicker({
      ...ticker,
      [productId]: _.take([newMessage, ...(ticker[productId] || [])], 100),
    });
  };

  return null;
};

export default DataFetcher;
