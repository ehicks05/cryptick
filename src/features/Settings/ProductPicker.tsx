import { X } from 'lucide-react';
import { ExchangeIcon } from '@/components/ExchangeIcon';
import { Button } from '@/components/ui/button';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '@/components/ui/combobox';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@/components/ui/item';
import { useProductIds } from '@/hooks/useStorage';
import { useExchangeInfo } from '@/services/useExchangeInfo';
import { useToggleProducts } from '@/services/useToggleProducts';

export const ProductPicker = () => {
	const { toggleProduct } = useToggleProducts();
	const { productIds } = useProductIds();

	const { data } = useExchangeInfo();
	const products = data?.products || {};

	const items = Object.values(products)
		.filter((product) => !productIds.includes(product.id))
		.map(({ id, displayName, exchange }) => ({
			label: displayName,
			value: id,
			exchange,
		}));

	return (
		<div className="grid gap-4">
			<div className="w-fit">
				<div>Toggle Products</div>
				<Combobox items={items} limit={10}>
					<ComboboxInput placeholder="Search products..." />
					<ComboboxContent>
						<ComboboxEmpty>No items found.</ComboboxEmpty>
						<ComboboxList>
							{(product) => (
								<ComboboxItem
									key={product.value}
									value={product}
									onClick={() => toggleProduct(product.value)}
								>
									<ExchangeIcon name={product.exchange} />
									{product.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>

			<ItemGroup className="grid grid-cols-2">
				{productIds
					.map((productId) => products[productId])
					.map((product) => (
						<Item key={product.id} variant="muted" size="xs">
							<ItemMedia variant="image">
								<ExchangeIcon name={product.exchange} />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{product.displayName}</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Button
									variant="destructive"
									size="icon"
									onClick={() => toggleProduct(product.id)}
								>
									<X />
								</Button>
							</ItemActions>
						</Item>
					))}
			</ItemGroup>
		</div>
	);
};
