import React from "react";

interface PatientHandout {
  id: string;
  description: string;
  url: string;
  [key: string]: string;
}

const EditPatientHandout = ({
  index,
  item,
  handleItemChange,
}: {
  index: number;
  item: PatientHandout;
  handleItemChange: (handoutIndex: number, handout: PatientHandout) => void;
}) => {
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } else {
      throw new Error('Dataset "field" attribute is false or undefined.');
    }
  };

  return (
    <div className="edit--section--list--item">
      <input
        type="string"
        className="input"
        placeholder="Handout Language"
        data-field="description"
        defaultValue={item.description}
        onChange={handleFieldChange}
      />
      <input
        type="string"
        className="input"
        placeholder="http://"
        data-field="url"
        defaultValue={item.url}
        onChange={handleFieldChange}
      />
    </div>
  );
};

export default EditPatientHandout;
