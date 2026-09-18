import { cn } from 'cn';
import React from 'react';
import { useProductIds } from '@/hooks/useStorage';
import { DndProvider, SortableItem } from './Dnd';
import Product from './Product';

const Products = () => {
	const { productIds, setProductIds } = useProductIds();

	return (
		<DndProvider ids={productIds} setIds={setProductIds}>
			<div
				className={cn(
					'w-full grid gap-2',
					'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]',
					'[min-w-400px]:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]',
				)}
			>
				{productIds.map((productId, i) => {
					return (
						<SortableItem key={productId} id={productId} index={i}>
							<Product productId={productId} />
						</SortableItem>
					);
				})}
			</div>
		</DndProvider>
	);
};

export default React.memo(Products);
