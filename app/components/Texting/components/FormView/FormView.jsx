import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  normalize,
  validatePhoneNumber,
} from '../../../../utils/validatePhoneNumber';
import Heading from './Heading';
import Privacy from './Privacy';
import Buttons from './Buttons';
import styles from './Form.module.scss';

const initialState = {
  recipientName: '',
  agreed: false,
};

const FormView = ({ service, handleSubmit, closeModal }) => {
  const [state, setState] = useState(initialState);
  const { recipientName, agreed } = state;
  const [phoneNumber, setPhoneNumber] = useState('');
  const { serviceName, serviceId } = service;

  const onChange = evt => {
    const {
      type,
      name,
      value,
      checked,
    } = evt.target;
    const newValue = type === 'checkbox' ? checked : value;
    setState(prevState => ({ ...prevState, [name]: newValue }));
  };

  const onPhoneNumberChange = evt => {
    const normalized = normalize(evt.target.value);
    setPhoneNumber(normalized);
  };

  const onSubmit = event => {
    event.preventDefault();
    const data = {
      recipient_name: recipientName,
      phone_number: phoneNumber,
      service_id: serviceId,
    };
    handleSubmit(data);
  };

  const isValidNumber = validatePhoneNumber(phoneNumber);

  return (
    <div>
      <Heading serviceName={serviceName} />
      <div className={styles.inputField}>
        <label className={styles.label}>
          First name (optional)
          <input
            type="text"
            name="recipientName"
            className={styles.input}
            value={recipientName}
            onChange={onChange}
          />
        </label>
        <label className={styles.label}>
          Phone number (required)
          <div className={styles.dataRates}>
            *Standard text and data rates may apply.
          </div>
          <div className={styles.phoneInputBox}>
            <span className={styles.phoneInputPrefix}>+1</span>
            <input
              type="text"
              name="phoneNumber"
              className={styles.phoneInput}
              value={phoneNumber}
              maxLength="14"
              onChange={onPhoneNumberChange}
            />
          </div>
        </label>
        <label className={styles.checkBox}>
          <input
            type="checkbox"
            name="agreed"
            checked={agreed}
            className={styles.checkBox}
            onChange={onChange}
          />
          I agree to receive text messages from SF Service Guide.
        </label>
      </div>
      <Buttons
        disabled={!agreed || !isValidNumber}
        closeModal={closeModal}
        onSubmit={onSubmit}
      />
      <Privacy />
    </div>
  );
};

FormView.propTypes = {
  service: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    serviceId: PropTypes.number.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default FormView;
