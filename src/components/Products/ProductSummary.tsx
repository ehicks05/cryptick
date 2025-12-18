import { useExchangeInfo } from 'services/useExchangeInfo';
import { useThrottledPrice } from 'store';
import type { CryptickProduct } from 'types';
import { ExchangeIcon } from './ExchangeIcon';

interface NameProps {
	product: CryptickProduct;
}

const Name = ({ product }: NameProps) => {
	const { data } = useExchangeInfo();
	const currency = data?.currencies?.[product.baseAsset];

	return (
		<div className="flex flex-col text-xl items-baseline leading-tight">
			{product.displayName}
			<div className="flex gap-1 items-center">
				<span className="text-xs text-muted-foreground">{currency?.name}</span>
				<span className="text-xs text-muted-foreground">·</span>
				<ExchangeIcon name={product.exchange} />
			</div>
		</div>
	);
};

interface PriceProps {
	productId: string;
}

const Price = ({ productId }: PriceProps) => {
	const price = useThrottledPrice(productId);

	return (
		<div className="flex gap-2 mb-4 font-mono">
			<span className="text-xl font-semibold leading-tight" id={`${productId}Price`}>
				{price}
			</span>
		</div>
	);
};

export const ProductSummary = ({ productId }: { productId: string }) => {
	const { data } = useExchangeInfo();
	const product = data?.products?.[productId];

	if (!product) {
		return '';
	}

	return (
		<div className="flex justify-between p-4 pt-2 pb-0">
			<Name product={product} />
			<Price productId={productId} />
		</div>
	);
};
