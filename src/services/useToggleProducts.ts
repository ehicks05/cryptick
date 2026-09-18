import { useProductIds } from '@/hooks/useStorage';
import { useCoinbaseWebsocket } from '@/services/cbp/useCoinbaseWebsocket';
import { buildCoinbaseMessage } from '@/services/cbp/utils';
import { useKrakenWebsocket } from '@/services/kraken/useKrakenWebsocket';
import { buildKrakenMessage } from '@/services/kraken/utils';
import { useExchangeInfo } from './useExchangeInfo';

export const useToggleProducts = () => {
	const { sendCoinbaseMessage } = useCoinbaseWebsocket();
	const { sendKrakenMessage } = useKrakenWebsocket();
	const { productIds, setProductIds } = useProductIds();

	const { data: exchangeInfo } = useExchangeInfo();

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendCoinbaseMessage(buildCoinbaseMessage(isAdding, [productId]));

		const krakenWsProductId = exchangeInfo?.products[productId].wsName;
		sendKrakenMessage(buildKrakenMessage(isAdding, [krakenWsProductId || '']));
	};

	return { toggleProduct };
};
