import React from 'react';

interface PatientHandout {
  id: string;
  language: string;
  link: string;
  [key: string]: string;
}

const EditPatientHandout = ({ index, item, handleItemChange }: {
  index: number;
  item: PatientHandout;
  handleItemChange: (handoutIndex: number, handout: PatientHandout) => void;
}) => {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    const { field } = e.target.dataset;
    if (field) {
      if (item[field] || value !== item[field]) {
        const newHandout = {
          ...item,
          [field]: value,
        };

        handleItemChange(index, newHandout);
      }
    }
  };

  return (
    <>
      <input
        type="string"
        className="input"
        placeholder="Handout Language"
        data-field="language"
        defaultValue={item.language}
        onChange={handleFieldChange}
      />
      <input
        type="string"
        className="input"
        placeholder="Handout Link"
        data-field="link"
        defaultValue={item.link}
        onChange={handleFieldChange}
      />
    </>
  );
};

export default EditPatientHandout;
