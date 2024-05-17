import React, { ComponentType, useCallback, useState } from "react";
import { DragAndDropCard } from "./DragAndDropCard";

interface CardItem {
  [key: string]: string | number;
};

export type InnerCardComponent = ComponentType<{description: string; id: number; url?: string}>

// This component is modeled after the `react-dnd` simple list example:
// https://react-dnd.github.io/react-dnd/examples/sortable/simple
export const DragAndDropContainer = ({
  cardData,
  InnerCard,
}: {
  cardData: CardItem[];
  InnerCard: InnerCardComponent;
}) => {
  const [cards, setCards] = useState(cardData);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newCards = [...cards];
      const draggedCard = newCards[dragIndex];

      // Remove draggedCard from old index
      newCards.splice(dragIndex, 1);

      // Update card order with new index of draggedCard
      setCards([
        ...newCards.slice(0, hoverIndex),
        draggedCard,
        ...newCards.slice(hoverIndex),
      ]);
    },
    [cards]
  );

  const renderCard = useCallback(
    (card, index) => {
      return (
        <DragAndDropCard
          key={card.id}
          index={index}
          id={card.id}
          moveCard={moveCard}
        >
          <InnerCard description={card.description} id={card.id} url={card.url}/>
        </DragAndDropCard>
      );
    },
    [InnerCard, moveCard]
  );

  return <>{cards.map((card, i) => renderCard(card, i))}</>;
};
