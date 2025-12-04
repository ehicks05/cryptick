import { arrayMove } from '@dnd-kit/helpers';
import { DragDropProvider, PointerSensor } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import type { ReactNode } from 'react';

interface DndProviderProps {
	ids: string[];
	setIds: (ids: string[]) => void;
	children: ReactNode;
}

export const DndProvider = ({ ids, setIds, children }: DndProviderProps) => {
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
				setIds(arrayMove(ids, from, to));
			}}
		>
			{children}
		</DragDropProvider>
	);
};

interface SortableItemProps {
	id: string;
	index: number;
	children: ReactNode;
}

export const SortableItem = ({ id, index, children }: SortableItemProps) => {
	const { isDragging, ...sortable } = useSortable({ id, index });

	// prevent link clicks while dragging
	const classes = isDragging ? 'pointer-events-none' : '';

	return (
		<div ref={sortable.ref} className={classes}>
			{children}
		</div>
	);
};
