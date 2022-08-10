import React, {
  FC, useState, useRef, useEffect,
} from 'react';

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
      // We only want to update the parent service when an item is deleted or modified;
      // we don't want to call update when an empty template has been added
      handleCollectionChange(propertyKeyName, resourceCollection);
    }
  }, [resourceCollection]);

  const addItem = () => {
    updateParentService.current = false;
    const newItem = {
      ...blankTemplateObj,
      keyId: Math.random(),
    };

    setResourceCollection([...resourceCollection, newItem]);
  };

  const handleItemChange = (index: number, item: any) => {
    updateParentService.current = true;
    const newCollection = [
      ...resourceCollection.slice(0, index),
      item,
      ...resourceCollection.slice(index + 1),
    ];

    setResourceCollection(newCollection);
  };

  const removeItem = (index: number) => {
    updateParentService.current = true;
    const newCollection = [
      ...resourceCollection.slice(0, index),
      ...resourceCollection.slice(index + 1),
    ];

    setResourceCollection(newCollection);
  };

  interface ResourceItem {
    id: string;
    keyId: number;
  }

  const createItemComponents = (itemComponentCollection: resourceItem[]) => (
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
