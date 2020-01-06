import React from 'react';
import PropTypes from 'prop-types';

const EditAddress = ({ address, setAddress, setHasLocation }) => (
  <AddressForm
    setAddress={setAddress}
    setHasLocation={setHasLocation}
    address={address}
  />
);

EditAddress.propTypes = {
  address: PropTypes.object,
  setAddress: PropTypes.func.isRequired,
  setHasLocation: PropTypes.func.isRequired,
};

EditAddress.defaultProps = {
  address: null,
};

const AddressForm = ({
  setHasLocation, setAddress, address,
}) => {
  const handleFieldChange = event => {
    const { target } = event;
    const { value, dataset: { field } } = target;
    setAddress({ ...address, [field]: value });
  };
  return (
    <li key="address" className="edit--section--list--item">
      <label htmlFor="address">Address</label>
      <label className="inline-checkbox">
        <input
          type="checkbox"
          className="input-checkbox"
          checked={!address}
          onChange={e => setHasLocation(!e.target.checked)}
        />
        No Physical Location
      </label>
      {address
        && (
          <div>
            <input
              type="text"
              className="input"
              placeholder="Name"
              data-field="name"
              value={address.name}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Address 1"
              data-field="address_1"
              value={address.address_1}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Address 2"
              data-field="address_2"
              value={address.address_2}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Address 3"
              data-field="address_3"
              value={address.address_3}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Address 4"
              data-field="address_4"
              value={address.address_4}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="City"
              data-field="city"
              value={address.city}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="State/Province"
              data-field="state_province"
              value={address.state_province}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Country"
              data-field="country"
              value={address.country}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              className="input"
              placeholder="Postal/Zip Code"
              data-field="postal_code"
              value={address.postal_code}
              onChange={handleFieldChange}
            />
          </div>
        )
    }
    </li>
  );
};

export default EditAddress;
