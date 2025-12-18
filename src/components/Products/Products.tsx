import React from 'react';
import { useScreen } from 'usehooks-ts';
import { useProductIds } from '../../hooks/useStorage';
import { DndProvider, SortableItem } from './Dnd';
import Product from './Product';

const Products = () => {
	const { productIds, setProductIds } = useProductIds();

	const { width = 0 } = useScreen();
	const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 380;
	const style = {
		gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr))`,
	};

	return (
		<DndProvider ids={productIds} setIds={setProductIds}>
			<div className="w-full grid gap-2" style={style}>
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
