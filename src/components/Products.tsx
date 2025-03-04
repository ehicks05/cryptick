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
import React, { type CSSProperties } from 'react';
import { useProductIds } from '../hooks/useProductIds';
import Product from './Product';

const Products = () => {
	const [productIds, setProductIds] = useProductIds();

	const pointerSensor = useSensor(PointerSensor, {
		activationConstraint: {
			distance: 10,
		},
	});

	const sensors = useSensors(
		pointerSensor,
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
	const { setNodeRef, transform, transition, attributes, listeners, isDragging } =
		useSortable({ id });

	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		...(isDragging && {
			pointerEvents: 'none', // prevent link clicks while dragging
		}),
	};

	console.log({ isDragging });

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<Product productId={id} />
		</div>
	);
};

export default React.memo(Products);
