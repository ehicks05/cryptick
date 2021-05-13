import React from "react";
import Product from "./Product";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

const Products = ({
  isReorderEnabled,
  currencies,
  products,
  stats,
  candles,
  selectedProductIds,
  setSelectedProductIds,
  prices,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedProductIds.indexOf(active.id);
      const newIndex = selectedProductIds.indexOf(over.id);
      const updated = arrayMove(selectedProductIds, oldIndex, newIndex);
      setSelectedProductIds(updated);
    }
  };

  const gridClasses =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={selectedProductIds}
        strategy={rectSortingStrategy}
      >
        <div className="max-w-screen-2xl w-full mx-auto p-4">
          <div className={gridClasses}>
            {selectedProductIds.map((selectedProductId) => {
              return (
                <SortableItem
                  key={selectedProductId}
                  id={selectedProductId}
                  disabled={!isReorderEnabled}
                >
                  <Product
                    product={products[selectedProductId]}
                    productPrice={prices[selectedProductId]}
                    productStats={stats[selectedProductId].stats_24hour}
                    currency={
                      currencies[products[selectedProductId].base_currency]
                    }
                    productCandles={candles[selectedProductId]?.candles || []}
                  />
                </SortableItem>
              );
            })}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableItem = ({ id, disabled, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: disabled ? "auto" : "none",
  };

  if (disabled) {
    return <Link to={`/${id}`}>{children}</Link>;
  } else {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }
};

export default React.memo(Products);
