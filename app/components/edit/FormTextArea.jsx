import React from 'react';
import PropTypes from 'prop-types';

const FormTextArea = ({
  label, placeholder, value, setValue,
}) => (
  <li className="edit--section--list--item">
    <label htmlFor="textarea">{label}</label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={evt => setValue(evt.target.value)}
    />
  </li>
);

FormTextArea.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired, // A function to call when setting a new value
};

export default FormTextArea;
