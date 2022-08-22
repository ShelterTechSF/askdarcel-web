import React, { FC, useState } from 'react';

/**
 * Renders a child property collection of a Service as a list of individual components,
 * called ResourceObjectItem. Enables the user to add, modify, and delete members of
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

interface ResourceItem {
  keyId?: number;
  id?: string | number;
}

export const EditServiceChildCollection = <T extends ResourceItem> ({
  initialCollectionData,
  handleCollectionChange,
  ResourceObjectItem,
  label,
  blankTemplateObj,
  buttonText,
  propertyKeyName,
}: {
  initialCollectionData: any[];
  handleCollectionChange: (field: string, value: T[]) => void;
  ResourceObjectItem: FC<ComponentProps>;
  label: string;
  blankTemplateObj: T;
  buttonText: string;
  propertyKeyName: string;
}) => {
  const [resourceCollection, setResourceCollection] = useState<T[]>(
    initialCollectionData || [],
  );

  const addItem = () => {
    const newItem = {
      ...blankTemplateObj,
      keyId: Math.random(),
    };

    setResourceCollection([...resourceCollection, newItem]);
  };

  const handleItemChange = (index: number, item: any) => {
    const newCollection: T[] = [
      ...resourceCollection.slice(0, index),
      item,
      ...resourceCollection.slice(index + 1),
    ];

    setResourceCollection(newCollection);
    handleCollectionChange(propertyKeyName, newCollection);
  };

  const removeItem = (index: number) => {
    const newCollection = [
      ...resourceCollection.slice(0, index),
      ...resourceCollection.slice(index + 1),
    ];

    setResourceCollection(newCollection);
    handleCollectionChange(propertyKeyName, newCollection);
  };

  const createItemComponents = (itemComponentCollection: T[]) => (
    itemComponentCollection.map((item, index) => (
      <div key={item.id || item.keyId} className="edit--section--list--item--collection-container">
        <ResourceObjectItem
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
    ))
  );

  return (
    <>
      <label htmlFor="edit-item">{label}</label>
      <div className="edit--section--list--item--sublist">
        {createItemComponents(resourceCollection)}
      </div>
      <button type="button" className="edit--section--list--item--button solid-brand" onClick={addItem}>
        {buttonText}
      </button>
    </>
  );
};
