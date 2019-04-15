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
    this.setState(state => ({
      noLocation: !state.noLocation
    }), () => {
      const emptyAddress = {
        "address_1": "",
        "address_2": "",
        "address_3": "",
        "address_4": "",
        "city": "",
        "country": "",
        "postal_code": "",
        "state_province": ""
      };
      const { noLocation } = this.state;
      if (noLocation) {
        this.setState({address: emptyAddress}, () => {
          this.props.updateAddress(emptyAddress);
        });
      } else {
        const { address } = this.props;
        this.setState(address, () => {
          this.props.updateAddress(address);
        });
      }
    });
  }

  render() {
    const address = this.props.address || {};
    return (
      <AddressForm handleAddressChange={this.handleAddressChange} handleNoLocationChange={this.handleNoLocationChange} noLocation={this.state.noLocation} address={address} />
    );
  }
}

function hasNoLocation(address) {
  let someFieldExistsOrNewAddress = typeof address === "undefined" || address.address_1 != "" || address.address_2 != "" || address.address_1 != ""
    || address.address_3 != "" || address.address_4 != "" || address.city != "" || address.postal_code != ""
    || address.state_province != "" || address.country != "";
  if (someFieldExistsOrNewAddress) {
    return false;
  }
  return true;
}

function AddressForm(props) {
  if (props.noLocation) {
    return (
      <li key="address" className="edit--section--list--item">
        <label htmlFor="address">Address</label>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={props.noLocation}
          onChange={props.handleNoLocationChange} 
        />
        <div onClick={props.handleNoLocationChange}>No Physical Location</div>
      </li>
    );
  } else {
    return (
      <li key="address" className="edit--section--list--item">
        <label htmlFor="address">Address</label>
        <input
          type="checkbox"
          className="input-checkbox"
          checked={props.noLocation}
          onChange={props.handleNoLocationChange} 
        />
        <div onClick={props.handleNoLocationChange}>No Physical Location</div>
        <input
          type="text"
          className="input"
          placeholder="Address 1"
          data-field="address_1"
          defaultValue={props.address.address_1}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 2"
          data-field="address_2"
          defaultValue={props.address.address_2}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 3"
          data-field="address_3"
          defaultValue={props.address.address_3}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 4"
          data-field="address_4"
          defaultValue={props.address.address_4}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="City"
          data-field="city"
          defaultValue={props.address.city}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="State/Province"
          data-field="state_province"
          defaultValue={props.address.state_province}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Country"
          data-field="country"
          defaultValue={props.address.country}
          onChange={props.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Postal/Zip Code"
          data-field="postal_code"
          defaultValue={props.address.postal_code}
          onChange={props.handleAddressChange}
        />
      </li>
    );
  }
}

export default EditAddress;
