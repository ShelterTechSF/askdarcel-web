import React, { Component } from 'react';

class EditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = { address: {} };
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleAddressChange(e) {
    const field = e.target.dataset.field;
    const value = e.target.value;
    const address = this.state.address;
    address[field] = value;
    this.setState(address, () => {
      this.props.updateAddress(address);
    });
  }

  render() {
    const address = this.props.address || {};

    return (
      <li key="address" className="edit--section--list--item">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          className="input"
          placeholder="Address 1"
          data-field="address_1"
          defaultValue={address.address_1}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 2"
          data-field="address_2"
          defaultValue={address.address_2}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 3"
          data-field="address_3"
          defaultValue={address.address_3}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Address 4"
          data-field="address_4"
          defaultValue={address.address_4}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="City"
          data-field="city"
          defaultValue={address.city}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="State/Province"
          data-field="state_province"
          defaultValue={address.state_province}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Country"
          data-field="country"
          defaultValue={address.country}
          onChange={this.handleAddressChange}
        />
        <input
          type="text"
          className="input"
          placeholder="Postal/Zip Code"
          data-field="postal_code"
          defaultValue={address.postal_code}
          onChange={this.handleAddressChange}
        />
      </li>
    );
  }
}

export default EditAddress;
