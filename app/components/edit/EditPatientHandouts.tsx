import React, { FC } from 'react';
import _ from 'lodash';
import editCollectionHOC from './EditCollection';

interface patientHandout {
  language: string;
  link: string;
}

interface patientHandoutProps {
  item: patientHandout;
}


const PatientHandout: FC<patientHandoutProps> = (props) => {
  const { item } = props;
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handout: patientHandout,
    props: any) => {
      const { value } = e.target;
      const { field }  = e.target.dataset;
      const { handleChange, index, item } = props;
      if (field) {
        if (handout[field as keyof patientHandout] || value !== item[field]) {
          handout[field as keyof patientHandout] = value;
          // this.setState({ handout });
          handleChange(index, handout);
        }
      }
  }

  return (
    <li key={item.language} className="edit--section--list--item tel">
      <input
        type="string"
        className="input"
        placeholder="Handout Langauage"
        data-field="language"
        defaultValue={item.language}
        onChange={(e) => { handleFieldChange(e, item, props)}}
      />
      <input
        type="string"
        className="input"
        placeholder="Handout Link"
        data-field="link"
        defaultValue={item.link}
        onChange={(e) => { handleFieldChange(e, item, props)}}
      />
    </li>
  );
};

const PatientHandouts = editCollectionHOC(PatientHandout, 'Patient Handouts', {}, 'Add Handout');
export default PatientHandouts;

