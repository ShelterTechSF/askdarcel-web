import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../NavigatorDashboard.module.scss";

interface Card {
  id: string;
  index: number;
  children: React.ReactNode;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

// This component is modeled after the `react-dnd` simple list example:
// https://react-dnd.github.io/react-dnd/examples/sortable/simple
export const DragAndDropCard = ({ id, index, children, moveCard }: Card) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "card",

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },

    hover(item, monitor) {
      const hoverItem = item as Card;
      const dragIndex = hoverItem.index;
      const hoverIndex = index;

      if (!ref.current || dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // All is well, move the card
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      hoverItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",

    item: () => {
      return { id, index };
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};
