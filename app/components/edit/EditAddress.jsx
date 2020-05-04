import React from 'react';
import PropTypes from 'prop-types';
import editCollectionHOC from './EditCollection';

const HasPhysicalLocationToggle = ({ hasLocation, setHasLocation }) => (
  <label className="inline-checkbox">
    <input
      type="checkbox"
      className="input-checkbox"
      checked={!hasLocation}
      onChange={e => setHasLocation(!e.target.checked)}
    />
    No Physical Location
  </label>
);


const EditAddress = ({ index, item, handleChange }) => {
  const address = item;
  const handleFieldChange = event => {
    const { target } = event;
    const { value, dataset: { field } } = target;
    handleChange(index, { ...address, [field]: value });
  };
  return (
    <div>
      <div className="label">Address</div>
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
  );
};

EditAddress.propTypes = {
  item: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};


const EditAddressCollection = editCollectionHOC(EditAddress, 'Addresses', {}, 'Add Address');
EditAddressCollection.displayName = 'EditAddressCollection';


const EditAddresses = ({ addresses, setHasLocation, setAddresses }) => (
  <li key="address" className="edit--section--list--item">
    <HasPhysicalLocationToggle
      hasLocation={addresses.length !== 0}
      setHasLocation={setHasLocation}
    />
    <EditAddressCollection collection={addresses} handleChange={setAddresses} />
  </li>
);

EditAddresses.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  setHasLocation: PropTypes.func.isRequired,
  setAddresses: PropTypes.func.isRequired,
};

export default EditAddresses;
