import React, { useState } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { RiDeleteBin5Line, RiEditBoxLine } from 'react-icons/ri';
import editCollectionHOC from './EditCollection';

import s from './EditAddress.module.scss';

// Subcomponents

/** Modal containing the edit and add new address form.
 *
 * The form data is only synchronized with the outer component's state when the
 * form is submitted. This allows the user to back out of any changes with the
 * "Cancel" button. Therefore, we have chosen to implement the form inputs as
 * uncontrolled components.
 */
const EditAddressModal = ({
  isOpen, onRequestClose, defaultData, onSave,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave(Object.fromEntries(formData.entries()));
    onRequestClose();
  };
  return (
    <ReactModal
      className={s.modal}
      overlayClassName={s.overlay}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <form className={s.modalContent} onSubmit={handleSubmit}>
        <h1 className={s.title}>Add New Address</h1>
        <div className={s.formBody}>
          <label className={s.inputLabel}>
            Address name (optional)
            <input
              className={s.inputTextbox}
              type="text"
              name="name"
              placeholder="Name"
              defaultValue={defaultData.name}
            />
          </label>
          <div className={s.formControlGroup}>
            <span className={s.formControlGroupLabel}>Street Address</span>
            <input
              className={s.inputTextbox}
              type="text"
              name="address_1"
              placeholder="Address"
              defaultValue={defaultData.address_1}
            />
            <input
              className={s.inputTextbox}
              type="text"
              name="address_2"
              placeholder="Apartment, suite, unit, building, floor, etc."
              defaultValue={defaultData.address_2}
            />
          </div>
          <label className={s.inputLabel}>
            City
            <input
              className={s.inputTextbox}
              type="text"
              name="city"
              placeholder="City"
              defaultValue={defaultData.city}
            />
          </label>
          <label className={s.inputLabel}>
            State
            <input
              className={s.inputTextbox}
              type="text"
              name="state_province"
              placeholder="State"
              defaultValue={defaultData.state_province}
            />
          </label>
          <label className={s.inputLabel}>
            Zip code
            <input
              className={s.inputTextbox}
              type="text"
              name="postal_code"
              placeholder="Zip Code"
              defaultValue={defaultData.postal_code}
            />
          </label>
        </div>
        <div className={s.actionRow}>
          <button
            className={s.cancelButton}
            type="button"
            onClick={onRequestClose}
          >
            ← Cancel
          </button>
          <input
            className={s.addButton}
            type="submit"
            value="Add new address"
          />
        </div>
      </form>
    </ReactModal>
  );
};

EditAddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

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

/** Format address as a single line. */
const compactAddressDisplay = ({
  address_1, address_2, address_3, address_4, city, state_province, postal_code,
}) => {
  // No comma between state and postal code
  const state_postal = `${state_province} ${postal_code}`;
  const lines = [address_1, address_2, address_3, address_4, city, state_postal];
  return lines.filter(x => x).join(', ');
};

const AddressListItem = ({
  displayIndex, address, onEdit, onRemove,
}) => (
  <div className={s.listItemContainer}>
    <div className={s.listItemIndex}>
      {`${displayIndex}.`}
    </div>
    <div className={s.listItemName}>{address.name}</div>
    <div className={s.listItemAddress}>{compactAddressDisplay(address)}</div>
    <div className={s.listItemEdit}>
      <button className={s.listItemButton} type="button" onClick={onEdit}>
        <RiEditBoxLine />
        Edit
      </button>
    </div>
    <div className={s.listItemRemove}>
      <button className={s.listItemButton} type="button" onClick={onRemove}>
        <RiDeleteBin5Line />
        Remove
      </button>
    </div>
  </div>
);

// Main component

// For when we actually add TypeScript support
// type ModalState = { type: "closed" } | { type: "add" } | { type: "edit"; editingIndex: number };

const EditAddresses = ({ addresses, setHasLocation, setAddresses }) => {
  const [modalState, setModalState] = useState({ type: 'closed' });

  const closeModal = () => setModalState({ type: 'closed' });

  const modalIsOpen = modalState.type !== 'closed';
  let modalDefaultData;
  let modalOnSave;
  switch (modalState.type) {
    case 'closed':
      modalDefaultData = {};
      modalOnSave = () => {};
      break;
    case 'add': {
      modalDefaultData = {};
      modalOnSave = newData => setAddresses([...addresses, newData]);
      break;
    }
    case 'edit': {
      modalDefaultData = addresses[modalState.editingIndex];
      modalOnSave = newData => {
        const addressesCopy = addresses.slice();
        addressesCopy[modalState.editingIndex] = { ...newData, dirty: true };
        setAddresses(addressesCopy);
      };
      break;
    }
    default:
      throw new Error(`Unexpected modal state: ${modalState}`);
  }

  return (
    <li key="address" className="edit--section--list--item">
      <EditAddressModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        defaultData={modalDefaultData}
        onSave={modalOnSave}
      />
      <HasPhysicalLocationToggle
        hasLocation={addresses.length !== 0}
        setHasLocation={setHasLocation}
      />
      <EditAddressCollection collection={addresses} handleChange={setAddresses} />

      <div className={s.addressListTitle}>Location</div>
      <div className={s.addressList}>
        {addresses.map((address, i) => (
          <AddressListItem
            key={address.id || JSON.stringify(address)}
            displayIndex={i + 1}
            address={address}
            onEdit={() => setModalState({ type: 'edit', editingIndex: i })}
            onRemove={() => {}}
          />
        ))}
      </div>

      <button type="button" onClick={() => setModalState({ type: 'add' })}>
        Add location
      </button>
    </li>
  );
};

EditAddresses.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  setHasLocation: PropTypes.func.isRequired,
  setAddresses: PropTypes.func.isRequired,
};

export default EditAddresses;
