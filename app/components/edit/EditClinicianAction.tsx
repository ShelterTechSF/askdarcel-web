import React from 'react';
import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';
import styles from './EditClinicianAction.module.scss';

interface ClinicianAction {
  id: string;
  isCovidAction: boolean;
  action: string;
  [key: string]: string | boolean;
}

const EditClinicianAction = ({ index, item, handleItemChange }: {
  index: number;
  item: ClinicianAction;
  handleItemChange: (handoutIndex: number, handout: ClinicianAction) => void;
}) => {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetValue: string | boolean,
  ) => {
    const { field } = e.target.dataset;
    if (field) {
      if (item[field] || targetValue !== item[field]) {
        const newAction = {
          ...item,
          [field]: targetValue,
        };

        handleItemChange(index, newAction);
      }
    }
  };

  return (
    <>
      <input
        type="string"
        className="input"
        placeholder="Clinician Action"
        data-field="action"
        defaultValue={item.action}
        onChange={e => handleFieldChange(e, e.target.value)}
      />
      {/* <Checkbox
        dataField="isCovidAction"
        defaultChecked={item.isCovidAction}
        id={`covid-action-${index}`}
        onChange={e => handleFieldChange(e, e.target.checked)}
      /> */}
      {/* The "label" class is included per instructions in OrganizationEditPage file */}
      {/* <label htmlFor={`covid-action-${index}`} className={styles.covidActionLabel}>
        Is COVID action?
      </label> */}
    </>
  );
};

export default EditClinicianAction;
