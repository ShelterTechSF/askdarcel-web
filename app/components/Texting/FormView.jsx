import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Texting.scss';


const initialState = {
  user_name: '',
  phone_number: '',
  agreed: false,
};

const FormView = ({ resource, handleSubmit, toggle }) => {
  const [state, setState] = useState(initialState);
  const { user_name, phone_number, agreed } = state;

  // Phone number validator: prevent the user from clicking the submit button
  // before providing a valid US phone number.
  const phoneNumberValidator = () => /^\(?(\d{3})\)?[-. ]?(\d{3})[- . ]?(\d{4})$/.test(phone_number);

  const onSubmit = evt => {
    evt.preventDefault();
    const data = {
      first_name: user_name ? user_name.match(/\S+/g)[0] : '',
      last_name: user_name ? user_name.match(/\S+/g).slice(1).join(' ') : '',
      phone_number,
      resource_id: resource.id,
    };
    handleSubmit(data);
  };

  const onChange = evt => {
    const {
      type,
      name,
      value,
      checked,
    } = evt.target;

    const newValue = type === 'checkbox' ? checked : value;
    setState({ ...state, [name]: newValue });
  };

  return (
    <>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          {`Text me information for ${resource.name}`}
        </h1>
        <h3 className={styles.description}>You will receive their address and phone number.</h3>
      </div>

      <div className={styles.inputFields}>
        <div className={styles.inputField}>
          <label className={styles.label}>
            First name (optional)
            <input
              type="text"
              name="user_name"
              className={styles.input}
              value={user_name}
              data-field="name"
              onChange={onChange}
            />
          </label>
        </div>

        <div className={styles.inputField}>
          <label className={styles.label}>
            Phone number (required)
            <div className={styles.dataRates}>*Standard text and data rates may apply.</div>
            <input
              type="text"
              name="phone_number"
              className={styles.input}
              value={phone_number}
              data-field="phoneNumber"
              onChange={onChange}
            />
          </label>
        </div>

        <label className={`${styles.checkBox} ${styles.dataRates}`}>
          I agree to receive text messages from SF Service Guide.
          <input
            type="checkbox"
            name="agreed"
            checked={agreed}
            data-field="agree"
            onChange={onChange}
          />
        </label>
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.cancel} ${styles.button}`}
          onClick={toggle}
        >
          cancel
        </button>
        <button
          type="submit"
          className={`${styles.button} ${agreed && phoneNumberValidator() ? '' : styles.disabled}`}
          disabled={!(agreed && phoneNumberValidator())}
          data-field="submit"
          onClick={onSubmit}
        >
          Text me
        </button>
      </div>

      <div className={styles.privacy}>
        We will not share or sell your information with third party sites.
        For more information on privacy details, please go
        <a target="_blank" rel="noopener noreferrer" href="https://sfserviceguide.org/"> here </a>
        to view.
      </div>
    </>
  );
};

FormView.propTypes = {
  resource: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};


export default FormView;
