import React from 'react';

interface PatientHandout {
  id: string;
  language: string;
  link: string;
  [key: string]: string;
}

const EditPatientHandout = ({ index, item, handleItemChange }: {
  index: number;
  item: patientHandout;
  handleItemChange: (handoutIndex: number, handout: patientHandout) => null;
}) => {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handout: patientHandout,
  ) => {
    const { value } = e.target;
    const { field } = e.target.dataset;
    if (field) {
      if (handout[field] || value !== item[field]) {
        const newHandout = {
          ...handout,
        };
        newHandout[field] = value;
        handleItemChange(index, newHandout);
      }
    }
  };

  return (
    <div className="edit--section--list--item">
      <input
        type="string"
        className="input"
        placeholder="Handout Language"
        data-field="language"
        defaultValue={item.language}
        onChange={e => { handleFieldChange(e, item); }}
      />
      <input
        type="string"
        className="input"
        placeholder="Handout Link"
        data-field="link"
        defaultValue={item.link}
        onChange={e => { handleFieldChange(e, item); }}
      />
    </div>
  );
};

export default EditPatientHandout;
