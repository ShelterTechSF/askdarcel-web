import React, { Component } from 'react';

const hasNoLocation = address => {
  const someFieldExistsOrNewAddress = typeof address === 'undefined'
    || address.name !== '' || address.address_1 !== ''
    || address.address_2 !== '' || address.address_3 !== ''
    || address.address_4 !== '' || address.city !== '' || address.postal_code !== ''
    || address.state_province !== '' || address.country !== '';
  if (someFieldExistsOrNewAddress) {
    return false;
  }
  return true;
};

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
    const { updateAddress } = this.props;
    address[field] = value;
    this.setState(address, () => {
      updateAddress(address);
    });
  }

  handleNoLocationChange() {
    const { updateAddress } = this.props;
    this.setState(state => {
      const { address } = this.props;
      let newAddr;
      if (state.noLocation) {
        newAddr = address;
      } else {
        newAddr = {
          name: '',
          address_1: '',
          address_2: '',
          address_3: '',
          address_4: '',
          city: '',
          country: '',
          postal_code: '',
          state_province: '',
        };
      }
      return { noLocation: !state.noLocation, address: newAddr };
    }, () => {
      const { address } = this.state;
      updateAddress(address);
    });
  }

  render() {
    const { address = {} } = this.props;
    const { noLocation } = this.state;
    return (
      <AddressForm
        handleAddressChange={this.handleAddressChange}
        handleNoLocationChange={this.handleNoLocationChange}
        noLocation={noLocation}
        address={address}
      />
    );
  }
}

const AddressForm = ({
  noLocation, handleNoLocationChange, handleAddressChange, address,
}) => (
  <li key="address" className="edit--section--list--item">
    <label htmlFor="address">Address</label>
    <label>
      <input
        type="checkbox"
        className="input-checkbox"
        checked={noLocation}
        onChange={handleNoLocationChange}
      />
        No Physical Location
    </label>
    {!noLocation
        && (
          <div>
            <input
              type="text"
              className="input"
              placeholder="Name"
              data-field="name"
              defaultValue={address.name}
              onChange={handleAddressChange}
            />
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
          </div>
        )
    }
  </li>
);

export default EditAddress;
