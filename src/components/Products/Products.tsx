import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, PointerSensor } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import React from 'react';
import { useScreen } from 'usehooks-ts';
import { useProductIds } from '../../hooks/useStorage';
import Product from './Product';

const Products = () => {
	const [productIds, setProductIds] = useProductIds();

	const { width = 0 } = useScreen();
	const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 380;
	const style = {
		gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr))`,
	};

	const sensors = [
		PointerSensor.configure({ activationConstraints: { distance: { value: 10 } } }),
	];

	return (
		<DragDropProvider
			sensors={sensors}
			onDragEnd={(event) => {
				const { operation, canceled } = event;
				const { source, target } = operation;

				if (canceled || !isSortable(source) || !isSortable(target)) {
					return;
				}

				const from = source.sortable.initialIndex;
				const to = target.sortable.index;
				setProductIds(arrayMove(productIds, from, to));
			}}
		>
			<div className="w-full grid gap-2" style={style}>
				{productIds.map((productId, i) => {
					return <SortableItem key={productId} id={productId} index={i} />;
				})}
			</div>
		</DragDropProvider>
	);
};

interface SortableItemProps {
	id: string;
	index: number;
}

const SortableItem = ({ id, index }: SortableItemProps) => {
	const { isDragging, ...sortable } = useSortable({ id, index });

	// prevent link clicks while dragging
	const classes = isDragging ? 'pointer-events-none' : '';

	return (
		<div ref={sortable.ref} className={classes}>
			<Product productId={id} />
		</div>
	);
};

export default React.memo(Products);
