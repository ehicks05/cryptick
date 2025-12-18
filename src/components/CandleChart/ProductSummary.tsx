import { useExchangeInfo } from 'services/useExchangeInfo';
import { useThrottledPrice } from 'store';

const outer =
	'absolute bg-linear-to-b from-white dark:from-black via-white dark:via-black via-50% to-transparent';
const inner =
	'flex gap-2 items-baseline pl-2 pt-1 text-neutral-700 dark:text-neutral-400';

interface Props {
	productId: string;
}

export const ProductSummary = ({ productId }: Props) => {
	const { data } = useExchangeInfo();

	const product = data?.products?.[productId];
	const currency = product ? data?.currencies?.[product.baseAsset] : undefined;

	const price = useThrottledPrice(productId);

	if (!product) {
		return '';
	}

	const name = `${currency?.name ? `${currency.name} · ` : ''}${product.displayName}`;

	return (
		<div className={outer}>
			<div className={inner}>
				<span className="text-sm">
					{name} · {price}
				</span>
			</div>
		</div>
	);
};
