import React from 'react';
import PropTypes from 'prop-types';

const FormTextArea = ({
  label, placeholder, field, value, onChange,
}) => (
  <li className="edit--section--list--item">
    <label htmlFor="textarea">{label}</label>
    <textarea
      placeholder={placeholder}
      data-field={field}
      value={value}
      onChange={onChange}
    />
  </li>
);

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormTextArea;
