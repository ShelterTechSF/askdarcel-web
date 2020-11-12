import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Texting.scss';
import { images } from 'assets';
import  * as dataService from '../../utils/DataService';
import Loader from '../ui/Loader';

const initialState = {
  name: '',
  phoneNumber: '',
  agreed: false,
  isLoading: false,
  isSent: false,
  errors: false,
};

// Text resaurce informations to the user phone

const Texting = ({ toggle, resource }) => {

  const [state, setState] = useState(initialState);
  const { name, phoneNumber, agreed, isLoading, errors, isSent } = { ...state };

  // Data object to send to the Api
  // The logic in the values handles the missing information
  const data = {
    firstName : name ? name.match(/\S+/g)[0] : '',
    lastName: name ? name.match(/\S+/g).slice(1).join(' ') : '',
    mobilePhone: phoneNumber,
    phoneAlternate: "",
    phoneHome: "",
    phoneWork: "",
    tags: resource.categories,
    engagementType: "Resource Info",
    engagementInfo: {
        Org_Name: resource.name,
        Org_Address1: resource.addresses.length ? resource.addresses[0].address_1 : '',
        Org_Address2: resource.addresses.length ? resource.addresses[0].address_2 : '',
        City: resource.addresses.length ? resource.addresses[0].city : '',
        State: resource.addresses.length ? resource.addresses[0].state_province : '',
        Zip: resource.addresses.length ? resource.addresses[0].postal_code : '',
        Org_Phone: resource.phones ? resource.phones[0].number : ''
    }
  };

  // US phone number validator
  const phoneNumberValidator = () => 
    /^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})$/.test(phoneNumber);

  const onSubmit = evt => {
    evt.preventDefault();
    setState({ ...state, isLoading: true });

    const resp = async () => {
      dataService.post(
        "/api/textellent", { data: { ...data } }).then( response => {
          response.ok ? 
            setState({ ...state, isSent: true, isLoading: false })
            : setState({ ...state, errors: true, isLoading:false });
      });
    }
    resp();
  };

  const onChange = evt => {
    errors ? setState({ ...state, errors: false }) : null;
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    const name = evt.target.name;
    setState({ ...state, [name]: value });
  };

  // form view 
  const form = () => {
    return (
      ReactDOM.createPortal(
        <div className="overlay">
          <div className="popup">
          {errors && alert("Something went wrong, try again!")}
            <div className="closeIconDiv">
              <img src={images.icon('close')} alt="close" className="closeIcon" onClick={toggle}/>
            </div>
            <div className="heading">
              <h1 className="title">Text me information for <br></br><i>{resource.name}</i></h1>
              <h3 className="description">You will receive their address and phone number.</h3>
            </div>
    
            <div className="inputFields">
              <div className="inputField">
                <label className="label">First name (optional)</label>
                <input
                  type="text"
                  name="name" 
                  className="input" 
                  value={name}
                  data-field= "name"
                  onChange={onChange}/>
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
                  onChange={onChange}/>
              </div>
    
              <label className="checkBox dataRates" >
                I agree to receive text messages from SF Service Guide.
                <input
                  type="checkbox"
                  name="agreed"
                  checked={agreed}
                  data-field="agree"
                  onChange={onChange}/>
              </label>
            </div>
            <div className="buttons">
              <button
                type="button"
                className="cancel button"
                onClick={toggle}>
                cancel
              </button>
              <button
                type="submit"
                className={`button${agreed && phoneNumberValidator(phoneNumber) ? '' : ' disabled'}`}
                disabled={!(agreed && phoneNumberValidator(phoneNumber))}
                data-field="submit"
                onClick={onSubmit}>
                Text me
              </button>
    
            </div>
            <div className="privacy">We will not share or sell your information with third party sites. 
              For more information on privacy details, please go <a target="_blank" rel="noopener noreferrer" href="#">here</a> to view.
            </div>
          </div>
        </div>, document.body
      )
    )
  };

  // Loading spinner view 
  const loading =  () => {
    return (
      <div className="overlay"> 
        <div className="popup">
          <Loader />
        </div>
      </div>
    )
  };

  // Success sending view 
  const sent = () => {
    return (
      <div className="overlay"> 
        <div className="popup">
          <div className="closeIconDiv">
            <img src={images.icon('close')} alt="close" className="closeIcon" onClick={toggle}/>
          </div>
          <div className="sentIcons">
            <div className="circle">
              <img src={images.icon('check-mark')} alt="check-mark" className="checMarkkIcon" onClick={toggle}/>
              <h1 className="sentText">Sent!</h1>
            </div>
          </div>
          
        </div>
      </div>
    )
  };

  return isSent ? sent() : isLoading ? loading() : form();
};

Texting.propTypes = {
  resource: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Texting;
