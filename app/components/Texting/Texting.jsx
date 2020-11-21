import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Texting.scss';
import { images } from 'assets';
import * as dataService from '../../utils/DataService';
import Loader from '../ui/Loader';

// Initial state's values
const initialState = {
  userName: '',
  phoneNumber: '',
  agreed: false,
  isLoading: false,
  isSent: false,
  error: false,
};

// Text resource informations to the user phone

const Texting = ({ toggle, resource }) => {
  const [state, setState] = useState(initialState);

  const {
    userName,
    phoneNumber,
    agreed,
    isLoading,
    error,
    isSent,
  } = state;

  const {
    categories,
    id,
    addresses,
    phones,
  } = resource;
  // Data to send to the Api, The logic in the values handles the missing infos.
  const data = {
    firstName: userName ? userName.match(/\S+/g)[0] : '',
    lastName: userName ? userName.match(/\S+/g).slice(1).join(' ') : '',
    mobilePhone: phoneNumber.replace(/\s/g, ''),
    phoneAlternate: '',
    phoneHome: '',
    phoneWork: '',
    tags: categories,
    resourceId: id,
    engagementType: 'Resource Info',
    engagementInfo: {
      Org_Name: resource.name,
      Org_Address1: addresses.length ? addresses[0].address_1 : '',
      Org_Address2: addresses.length ? addresses[0].address_2 : '',
      City: addresses.length ? addresses[0].city : '',
      State: addresses.length ? addresses[0].state_province : '',
      Zip: addresses.length ? addresses[0].postal_code : '',
      Org_Phone: phones ? phones[0].number : '',
    },
  };

  // Phone number validator: prevent the user from clicking the submit button
  // before providing a valid US phone number.
  const phoneNumberValidator = () => /^\(?(\d{3})\)?[-. ]?(\d{3})[- . ]?(\d{4})$/.test(phoneNumber);

  // Send data to backend
  const sendData = async () => dataService.post(
    '/api/textings', { data },
  ).then(response => {
    if (response.ok) {
      setState({ ...initialState, isSent: true });
    }
  })
    .catch(errors => setState({ ...initialState, error: errors }));

  const onSubmit = evt => {
    evt.preventDefault();
    // Set isLoading to True to start the backend post request
    setState({ ...state, isLoading: true });
    sendData();
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

  // form view: show inputs
  const formView = () => (
    <>
      <div className="heading">
        <h1 className="title">
          {`Text me information for ${resource.name}`}
        </h1>
        <h3 className="description">You will receive their address and phone number.</h3>
      </div>

      <div className="inputFields">
        <div className="inputField">
          <div className="label">First name (optional)</div>
          <input
            type="text"
            name="userName"
            className="input"
            value={userName}
            data-field="name"
            onChange={onChange}
          />
        </div>

        <div className="inputField">
          <div className="label">Phone number (required)</div>
          <div className="dataRates">*Standard text and data rates may apply.</div>
          <input
            type="text"
            name="phoneNumber"
            className="input"
            value={phoneNumber}
            data-field="phoneNumber"
            onChange={onChange}
          />
        </div>

        <label className="checkBox dataRates">
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

      <div className="buttons">
        <button
          type="button"
          className="cancel button"
          onClick={toggle}
        >
          cancel
        </button>
        <button
          type="submit"
          className={`button${agreed && phoneNumberValidator(phoneNumber) ? '' : ' disabled'}`}
          disabled={!(agreed && phoneNumberValidator(phoneNumber))}
          data-field="submit"
          onClick={onSubmit}
        >
          Text me
        </button>
      </div>

      <div className="privacy">
        We will not share or sell your information with third party sites.
        For more information on privacy details, please go
        <a target="_blank" rel="noopener noreferrer" href="https://sfserviceguide.org/"> here </a>
        to view.
      </div>
    </>
  );

  // Loading spinner: Show a loading spinner when the request being processed in the Backend
  const loadingView = () => (<Loader />);

  // Success sending view
  const sentView = () => (
    <div className="responseIcons">
      <div className="circle">
        <img src={images.icon('check-mark')} alt="check-mark" className="responseIcon" />
        <h1 className="responseText" data-field="sent">Sent!</h1>
      </div>
    </div>
  );

  // Error View: show Alert graphic and a friendly message
  const errorView = () => (
    <div className="responseIcons error">
      <img src={images.icon('emergency')} alt="error" className="responseIcon" />
      <h1 className="responseText error">Sorry, something went wrong, please try again later.</h1>
    </div>
  );

  const view = () => {
    if (error) {
      return errorView();
    }
    if (isSent) {
      return sentView();
    }
    if (isLoading) {
      return loadingView();
    }
    return formView();
  };
  // create a portal to render Texting component on Top of the DOM hierarchy
  return (
    ReactDOM.createPortal(
      <div className="overlay">
        <div className="popup">
          <div className="closeIconDiv" role="button" onClick={toggle} tabIndex={0}>
            <img src={images.icon('close')} alt="close" className="closeIcon" />
          </div>
          { view() }
        </div>
      </div>, document.body,
    )
  );
};

Texting.propTypes = {
  resource: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Texting;
