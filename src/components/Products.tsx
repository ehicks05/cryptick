import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWindowSize } from '@uidotdev/usehooks';
import React from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { useProductIds } from '../hooks/useProductIds';
import Product from './Product';

const Products = () => {
	const [productIds, setProductIds] = useProductIds();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = productIds.indexOf(active.id.toString());
			const newIndex = productIds.indexOf(over.id.toString());
			const updated = arrayMove(productIds, oldIndex, newIndex);
			setProductIds(updated);
		}
	};

	const { width: _width } = useWindowSize();
	const width = _width || 0;
	const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 320;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={productIds} strategy={rectSortingStrategy}>
				<div className="w-full mx-auto p-4">
					<div
						className="grid gap-2"
						style={{
							gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr))`,
						}}
					>
						{productIds.map((productId) => {
							return <SortableItem key={productId} id={productId} />;
						})}
					</div>
				</div>
			</SortableContext>
		</DndContext>
	);
};

interface SortableItemProps {
	id: string;
}

const SortableItem = ({ id }: SortableItemProps) => {
	const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handle = (
		<MdDragIndicator
			className="text-muted shrink-0 focus:outline-none touch-none p-1"
			size={32}
			{...attributes}
			{...listeners}
		/>
	);

	return (
		<div ref={setNodeRef} style={style}>
			<Product productId={id} handle={handle} />
		</div>
	);
};

export default React.memo(Products);
