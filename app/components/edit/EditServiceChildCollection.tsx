import React, { FC, useState } from "react";

/**
 * Renders a child property collection of a Service as a list of individual components,
 * called CollectionItemComponent. Enables the user to add, modify, and delete members of
 * the collection and save to the DB.
 *
 * In the future, this component could possibly be abstracted to replace the
 * EditCollection HOC class-based JSX component that does essentially the same thing
 * for child property collections of Resources.
 */
interface ComponentProps {
  index: number;
  item: any;
  handleItemChange: any;
}

interface CollectionItem {
  service_id: number;
  id?: string | number;
  keyId?: number;
  isRemoved?: boolean;
}

export const EditServiceChildCollection = <T extends CollectionItem>({
  initialCollectionData,
  handleCollectionChange,
  CollectionItemComponent,
  label,
  blankItemTemplate,
  buttonText,
  propertyKeyName,
}: {
  initialCollectionData: any[] | undefined;
  handleCollectionChange: (field: string, value: T[]) => void;
  CollectionItemComponent: FC<ComponentProps>;
  label: string;
  blankItemTemplate: T;
  buttonText: string;
  propertyKeyName: string;
}) => {
  const [itemCollection, setItemCollection] = useState<T[]>(
    initialCollectionData || []
  );

  const addItem = () => {
    const newItem = {
      ...blankItemTemplate,
      keyId: Math.random(),
    };

    setItemCollection([...itemCollection, newItem]);
  };

  const handleItemChange = (index: number, item: any) => {
    const newCollection: T[] = [
      ...itemCollection.slice(0, index),
      item,
      ...itemCollection.slice(index + 1),
    ];

    setItemCollection(newCollection);
    handleCollectionChange(propertyKeyName, newCollection);
  };

  const removeItem = (index: number) => {
    let newCollection;
    const deletedItem = itemCollection[index];
    if (deletedItem.id) {
      deletedItem.isRemoved = true;
      newCollection = [
        ...itemCollection.slice(0, index),
        deletedItem,
        ...itemCollection.slice(index + 1),
      ];
    } else {
      newCollection = [
        ...itemCollection.slice(0, index),
        ...itemCollection.slice(index + 1),
      ];
    }

    setItemCollection(newCollection);
    handleCollectionChange(propertyKeyName, newCollection);
  };

  const itemComponents = itemCollection.flatMap((item, index) => {
    if (item.isRemoved) {
      return null;
    }

    return (
      <div
        key={item.id || item.keyId}
        className="edit--section--list--item--collection-container"
      >
        <CollectionItemComponent
          index={index}
          item={item}
          handleItemChange={handleItemChange}
        />
        <button
          type="button"
          className="trash-button icon-button"
          onClick={() => removeItem(index)}
        >
          <i className="material-icons">&#xE872;</i>
        </button>
      </div>
    );
  });

  return (
    <>
      <label htmlFor="edit-item">{label}</label>
      <div className="edit--section--list--item--sublist">{itemComponents}</div>
      <button
        type="button"
        className="edit--section--list--item--button solid-brand"
        onClick={addItem}
      >
        {buttonText}
      </button>
    </>
  );
};
