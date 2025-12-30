import { useBinanceWebsocket } from 'services/binance/useBinanceWebsocket';
import { buildBinanceMessage } from 'services/binance/utils';
import { useCoinbaseWebsocket } from 'services/cbp/useCoinbaseWebsocket';
import { buildCoinbaseMessage } from 'services/cbp/utils';
import { useKrakenWebsocket } from 'services/kraken/useKrakenWebsocket';
import { buildKrakenMessage } from 'services/kraken/utils';
import { useProductIds } from '../hooks/useStorage';

export const useToggleProducts = () => {
	const { sendCoinbaseMessage } = useCoinbaseWebsocket();
	const { sendBinanceMessage } = useBinanceWebsocket();
	const { sendKrakenMessage } = useKrakenWebsocket();
	const { productIds, setProductIds } = useProductIds();

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendCoinbaseMessage(buildCoinbaseMessage(isAdding, [productId]));
		sendBinanceMessage(buildBinanceMessage(isAdding, [productId]));
		sendKrakenMessage(buildKrakenMessage(isAdding, [productId]));
	};

	return { toggleProduct };
};
