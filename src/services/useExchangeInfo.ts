import { useQuery } from "@tanstack/react-query";
import { getExchangeInfo } from "services/binance/exchangeInfo";
import { getCurrencies } from "./cbp/endpoints/currencies";
import { getProducts } from "./cbp/endpoints/products";

export const collectExchangeInfo = async () => {
  const [currencies, products, exchangeInfo] = await Promise.all([
    getCurrencies(),
    getProducts(),
    getExchangeInfo(),
  ]);

  const combinedProducts = [
    ...Object.values(products),
    ...exchangeInfo.symbols,
  ];

  return {
    currencies,
    products: combinedProducts,
    _coinbase: { currencies, products },
    _binance: { exchangeInfo },
  };
};

export const useExchangeInfo = () =>
  useQuery({
    queryKey: ["exchangeInfo"],
    queryFn: collectExchangeInfo,
    staleTime: 1000 * 60 * 60 * 24,
  });
