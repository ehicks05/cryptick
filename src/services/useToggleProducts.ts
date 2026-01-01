import { useBinanceWebsocket } from 'services/binance/useBinanceWebsocket';
import { buildBinanceMessage } from 'services/binance/utils';
import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';
import { buildCoinbaseMessage } from 'services/cbp/utils';
import { useKrakenWebsocket } from 'services/kraken/useKrakenWebsocket';
import { buildKrakenMessage } from 'services/kraken/utils';
import { useProductIds } from '../hooks/useStorage';
import { useExchangeInfo } from './useExchangeInfo';

export const useToggleProducts = () => {
	const { sendCoinbaseMessage } = useCoinbaseWebsocket();
	const { sendBinanceMessage } = useBinanceWebsocket();
	const { sendKrakenMessage } = useKrakenWebsocket();
	const { productIds, setProductIds } = useProductIds();

	const { data: exchangeInfo } = useExchangeInfo();

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendCoinbaseMessage(buildCoinbaseMessage(isAdding, [productId]));
		sendBinanceMessage(buildBinanceMessage(isAdding, [productId]));

		const krakenWsProductId = exchangeInfo?.products[productId].wsName;
		sendKrakenMessage(buildKrakenMessage(isAdding, [krakenWsProductId || '']));
	};

	return { toggleProduct };
};
