import React from 'react';

interface PatientHandout {
  id: string;
  language: string;
  link: string;
  [key: string]: string;
}

// Todo: Once the API work is finished, we will need to tidy up how we are managing API
// requests involving patient handout data (called "documents") on the Service model as
// this PR was built prior to the development of the API. There will also need to be
// changes to the OrganizationEditPage#handleSubmit method to include a handout specific
// request in the manner of how we update service.notes.
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
