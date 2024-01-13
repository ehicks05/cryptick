import {
	DndContext,
	DragEndEvent,
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
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import useStore from '../store';
import Product from './Product';

const Products = () => {
	const isReorderEnabled = useStore((state) => state.isReorderEnabled);
	const selectedProductIds = useStore((state) => state.selectedProductIds);
	const setSelectedProductIds = useStore((state) => state.setSelectedProductIds);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = selectedProductIds.indexOf(active.id.toString());
			const newIndex = selectedProductIds.indexOf(over.id.toString());
			const updated = arrayMove(selectedProductIds, oldIndex, newIndex);
			setSelectedProductIds(updated);
		}
	};

	const { width } = useWindowSize();
	const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 320;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={selectedProductIds} strategy={rectSortingStrategy}>
				<div className="w-full mx-auto p-4">
					<div
						className="grid gap-2"
						style={{
							gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr))`,
						}}
					>
						{selectedProductIds.map((selectedProductId) => {
							return (
								<SortableItem
									key={selectedProductId}
									id={selectedProductId}
									disabled={!isReorderEnabled}
								>
									<Product productId={selectedProductId} />
								</SortableItem>
							);
						})}
					</div>
				</div>
			</SortableContext>
		</DndContext>
	);
};

interface SortableItemProps {
	id: string;
	disabled: boolean;
	children: ReactNode;
}

const SortableItem = ({ id, disabled, children }: SortableItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id,
		disabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		touchAction: disabled ? 'auto' : 'none',
	};

	if (disabled) {
		return <Link to={`/${id}`}>{children}</Link>;
	}
	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
};

export default React.memo(Products);
