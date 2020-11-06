import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Textellent.scss';
import { images } from 'assets';

const initialState = {
  name: '',
  phoneNumber: '',
  agreed: false,
  isLoading: false,
  errors: false,
}

const Textellent = ({ toggle, hit }) => {
  const [state, setState] = useState(initialState);
  const { name, phoneNumber, agreed, isLoading, errors } = {...state};
  
  console.log('....', hit)


  const handleSubmit = () => console.log('clicked')

  const PhoneNumberValidator = () => /^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})$/.test(phoneNumber);

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    setState({ ...state, [name]: value });
  };

  
  return ReactDOM.createPortal(
    <div className="overlay">
    <div className="popup">
      <div>
        <div className="closeIconDiv">
          <img src={images.icon('close')} alt="close" className="closeIcon" onClick={toggle}/>
        </div>
      </div>
      <div className="heading">
        <h1 className="title">Text me information for <br></br><i>{hit.name}</i></h1>
        <h3 className="description">You will receive their address and phone number.</h3>
      </div>

      <div className="inputFields">
        <div className="inputField">
          <label className="label">First name (optional)</label>
          <input type="text" name="name" className="input" value={name} onChange={onChange}/>
        </div>
        
        <div className="inputField">
          <div className="label">Phone number (required)</div>
          <div className="dataRates">*Standard text and data rates may apply.</div>
          <input type="text" name="phoneNumber" className="input" value={phoneNumber} onChange={onChange}/>
        </div>

        <label className="checkBox dataRates" >
          I agree to receive text messages from SF Service Guide.
          <input type="checkbox" name="agreed" checked={agreed} onChange={onChange}/>
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
        type="button"
        
        className={`button${agreed && PhoneNumberValidator(phoneNumber) ? '' : ' disabled'}`}
        disabled={true}
        onClick={handleSubmit}>
          Text me
        </button>

      </div>
      <div className="privacy">We will not share or sell your information with third party sites. 
      For more information on privacy details, please go <a target="_blank" rel="noopener noreferrer" href="#">here</a> to view.</div>
      

    </div>
    </div>, document.body
  );
}

export default Textellent;
