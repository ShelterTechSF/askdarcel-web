import React, { FC } from 'react';
import _ from 'lodash';

interface patientHandout {
  id: string;
  language: string;
  link: string;
  [key: string]: string | boolean;
}

const EditPatientHandout = ({index, item, handleItemChange}: {
  index: number;
  item: patientHandout;
  handleItemChange: (index: number, handout: patientHandout) => null;
}) => {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handout: patientHandout) => {
      const { value } = e.target;
      const { field }  = e.target.dataset;
      if (field) {
        if (handout[field] || value !== item[field]) {
          handout[field] = value;
          handleItemChange(index, handout);
        }
      }
  }

  return (
    <li key={item.id}
        className="edit--section--list--item tel">
      <input
        type="string"
        className="input"
        placeholder="Handout Langauage"
        data-field="language"
        defaultValue={item.language}
        onChange={(e) => { handleFieldChange(e, item)}}
      />
      <input
        type="string"
        className="input"
        placeholder="Handout Link"
        data-field="link"
        defaultValue={item.link}
        onChange={(e) => { handleFieldChange(e, item)}}
      />
    </li>
  );
};

export default EditPatientHandout;

