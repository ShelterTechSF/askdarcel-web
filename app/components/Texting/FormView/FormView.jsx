import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from './Heading';
import Privacy from './Privacy';
import Buttons from './Buttons';
import styles from '../Texting.scss';

const initialState = {
  recipient_name: '',
  phone_number: '',
  agreed: false,
};
const ServicePropTypes = PropTypes.shape({
  serviceName: PropTypes.string.isRequired,
  service_id: PropTypes.number.isRequired,
});

const FormView = ({ service, handleSubmit, closeModal }) => {
  const [state, setState] = useState(initialState);
  const { recipient_name, phone_number, agreed } = state;
  const { serviceName, service_id } = service;

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
      recipient_name,
      phone_number,
      service_id,
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
          name="recipient_name"
          className={styles.input}
          value={recipient_name}
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
          name="phone_number"
          placeholder=""
          className={styles.input}
          value={phone_number}
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
  service: ServicePropTypes.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default FormView;
