import React, { Component } from 'react';

class EditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = { address: {}, noLocation: hasNoLocation(props.address) };
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleNoLocationChange = this.handleNoLocationChange.bind(this);
  }

  handleAddressChange(e) {
    const { field } = e.target.dataset;
    const { value } = e.target;
    const { address } = this.state;
    address[field] = value;
    this.setState(address, () => {
      this.props.updateAddress(address);
    });
  }

  handleNoLocationChange(e) {
    this.setState((state, props) => {
      let newAddr;
      if (state.noLocation) {
        newAddr = this.props.address;
      } else {
        newAddr = {
          "address_1": "",
          "address_2": "",
          "address_3": "",
          "address_4": "",
          "city": "",
          "country": "",
          "postal_code": "",
          "state_province": ""
        };
      }
      return {noLocation: !state.noLocation, address: newAddr};
    }, () => {
      this.props.updateAddress(this.state.address);
    });
  }

  render() {
    const address = this.props.address || {};
    return (
      <AddressForm handleAddressChange={this.handleAddressChange}
      handleNoLocationChange={this.handleNoLocationChange} 
      noLocation={this.state.noLocation} address={address} />
    );
  }
}

const hasNoLocation = (address) => {
  let someFieldExistsOrNewAddress = typeof address === "undefined" || address.address_1 != "" ||
    address.address_2 != "" || address.address_1 != "" || address.address_3 != "" || 
    address.address_4 != "" || address.city != "" || address.postal_code != "" ||
    address.state_province != "" || address.country != "";
  if (someFieldExistsOrNewAddress) {
    return false;
  }
  return true;
};

const AddressForm = ({noLocation, handleNoLocationChange, handleAddressChange, address}) => {
  if (noLocation) {
    return (
      <li key="address" className="edit--section--list--item">
        <label htmlFor="address">Address</label>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={noLocation}
          onChange={handleNoLocationChange} 
        />
        <div onClick={handleNoLocationChange}>No Physical Location</div>
      </li>
    );
  } else {
    return (
      <li key="address" className="edit--section--list--item">
        <label htmlFor="address">Address</label>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={noLocation}
          onChange={handleNoLocationChange} 
        />
        <div onClick={handleNoLocationChange}>No Physical Location</div>
        <input
          type="text"
          className="input"
          placeholder="Address 1"
          data-field="address_1"
          defaultValue={address.address_1}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 2"
          data-field="address_2"
          defaultValue={address.address_2}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 3"
          data-field="address_3"
          defaultValue={address.address_3}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 4"
          data-field="address_4"
          defaultValue={address.address_4}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="City"
          data-field="city"
          defaultValue={address.city}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="State/Province"
          data-field="state_province"
          defaultValue={address.state_province}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Country"
          data-field="country"
          defaultValue={address.country}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Postal/Zip Code"
          data-field="postal_code"
          defaultValue={address.postal_code}
          onChange={handleAddressChange}
        />
      </li>
    );
  }
};

export default EditAddress;
