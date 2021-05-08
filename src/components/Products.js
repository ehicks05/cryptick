import React from "react";
import ProductSection from "./ProductSection";
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

const Products = ({
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
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center p-4">
          {selectedProductIds.map((selectedProductId) => {
            return (
              <SortableItem key={selectedProductId} id={selectedProductId}>
                <ProductSection
                  product={products[selectedProductId]}
                  productPrice={prices[selectedProductId]}
                  productStats={stats[selectedProductId]}
                  currency={
                    currencies[products[selectedProductId].base_currency]
                  }
                  productCandles={candles[selectedProductId]?.candles || []}
                />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
};

export default React.memo(Products);
