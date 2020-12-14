import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from './Heading';
import Privacy from './Privacy';
import Buttons from './Buttons';
import styles from './Form.module.scss';

const initialState = {
  recipientName: '',
  phoneNumber: '',
  agreed: false,
};

const FormView = ({ service, handleSubmit, closeModal }) => {
  const [state, setState] = useState(initialState);
  const { recipientName, phoneNumber, agreed } = state;
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

  const onSubmit = event => {
    event.preventDefault();
    const data = {
      recipientName,
      phoneNumber,
      serviceId,
    };
    handleSubmit(data);
  };

  return (
    <div>
      <Heading serviceName={serviceName} />
      <label className={styles.label}>
        First name (optional)
        <input
          type="text"
          name="recipientName"
          className={styles.input}
          value={recipientName}
          data-field="recipientName"
          onChange={onChange}
        />
      </label>
      <label className={styles.label}>
        Phone number (required)
        <div className={styles.dataRates}>
          *Standard text and data rates may apply.
        </div>
        <input
          type="text"
          name="phoneNumber"
          className={styles.input}
          value={phoneNumber}
          data-field="phoneNumber"
          onChange={onChange}
        />
      </label>
      <label className={styles.checkBox}>
        <input
          type="checkbox"
          name="agreed"
          checked={agreed}
          className={styles.checkBox}
          data-field="agree"
          onChange={onChange}
        />
        I agree to receive text messages from SF Service Guide.
      </label>
      <Buttons disabled={!agreed} closeModal={closeModal} onSubmit={onSubmit} />
      <Privacy />
    </div>
  );
};

FormView.propTypes = {
  service:  PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    serviceId: PropTypes.number.isRequired,
  }),
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default FormView;
