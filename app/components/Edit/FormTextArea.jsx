import React from 'react';
import PropTypes from 'prop-types';

const FormTextArea = (props) => {
  const { label, placeholder, field, defaultValue, onChange } = props;
  return (
    <li className="edit--section--list--item">
      <label htmlFor="textarea">{label}</label>
      <textarea
        placeholder={placeholder}
        data-field={field}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </li>
  );
};

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired.isRequired,
};

export default FormTextArea;
