import React, { FC, useState, useRef, useEffect } from 'react';

/**
 * Renders a child property collection of a Service as a list of individual components,
 * called ResourceObjectItem. Enables the user to add, modify, and delete individual
 * components and save to the DB. This component could possibly be abstracted to replace
 * the EditCollection HOC class-based component that does essentially the same thing
 * for child property collections of Resources
 */
interface componentProps {
  index: number;
  item: any;
  handleItemChange: any;
};

export const EditServiceChildCollection = ({
  initialCollectionData,
  handleCollectionChange,
  ResourceObjectItem,
  label,
  blankTemplateObj,
  buttonText,
  propertyKeyName,
}: {
  initialCollectionData: any[];
  handleCollectionChange: (field: any, value: any) => null;
  ResourceObjectItem: FC<componentProps>;
  label: string;
  blankTemplateObj: object;
  buttonText: string;
  propertyKeyName: string;
}) => {
  const [resourceCollection, setResourceCollection] = useState(initialCollectionData || []);
  const firstUpdate = useRef(true);
  const updateParentService = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (updateParentService.current) {
      // We only want to update the parent service when an already existing item is deleted or
      // modified; we don't want to call update when an empty template has been added or removed
      handleCollectionChange(propertyKeyName, resourceCollection);
    }
  }, [resourceCollection]);

  const addItem = () => {
    updateParentService.current = false;
    setResourceCollection([...resourceCollection, blankTemplateObj]);
  }

  const handleItemChange = (index: number, item: any) => {
    updateParentService.current = true;
    const newCollection = [
      ...resourceCollection.slice(0, index),
      item,
      ...resourceCollection.slice(index + 1),
    ];

    setResourceCollection(newCollection);
  }

  const removeItem = (index: number, item: any) => {
    const newCollection = [
      ...resourceCollection.slice(0, index),
      ...resourceCollection.slice(index + 1),
    ];

    if (item.id) {
      // Deleted item exists in DB; thus parent service needs to be updated
      updateParentService.current = true;
    }

    setResourceCollection(newCollection);
  };

  const createItemComponents = (itemComponentCollection: object[]) => {
    return itemComponentCollection.map((item, index) => (
      <li key={index} className="edit--section--list--item--collection-container">
        <ul>
          <ResourceObjectItem
            index={index}
            item={item}
            handleItemChange={handleItemChange}
          />
        </ul>
        <button
          type="button"
          className="trash-button icon-button"
          onClick={() => removeItem(index, item)}
        >
          <i className="material-icons">&#xE872;</i>
        </button>
      </li>
    ));
  };

  return (
    <>
      <label htmlFor="edit-item">{label}</label>
      <ul className="edit--section--list--item--sublist">
        {createItemComponents(resourceCollection)}
      </ul>
      <button type="button" className="edit--section--list--item--button solid-brand" onClick={addItem}>
        {buttonText}
      </button>
    </>
  );
};