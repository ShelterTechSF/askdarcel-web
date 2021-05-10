import React, { useState } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { RiDeleteBin5Line, RiEditBoxLine } from 'react-icons/ri';

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
  const isEdit = !!defaultData.id;
  const title = isEdit ? 'Edit Address' : 'Add New Address';
  const submitButtonText = isEdit ? 'Save address' : 'Add new address';
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newData = Object.fromEntries(formData.entries());
    if (isEdit) {
      newData.id = defaultData.id;
    }
    onSave(newData);
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
        <h1 className={s.title}>{title}</h1>
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
              required
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
              required
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
              required
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
              required
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
            value={submitButtonText}
          />
        </div>
      </form>
    </ReactModal>
  );
};

EditAddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

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

const EditAddresses = ({ addresses, setAddresses }) => {
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

  const removeAddress = index => {
    const address = addresses[index];
    const newAddresses = addresses.slice();
    if (address.id) {
      newAddresses[index] = { ...address, isRemoved: true };
    } else {
      newAddresses.splice(index, 1);
    }
    setAddresses(newAddresses);
  };

  return (
    <li key="address" className="edit--section--list--item">
      <EditAddressModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        defaultData={modalDefaultData}
        onSave={modalOnSave}
      />

      <div className={s.addressListTitle}>Location</div>
      <div className={s.addressList}>
        {addresses
          .map((address, arrayIndex) => [address, arrayIndex])
          .filter(([address]) => !address.isRemoved)
          // The displayIndex should skip over any elements that have been
          // marked for removal, but the arrayIndex must be the actual index of
          // the element in the addresses array
          .map(([address, arrayIndex], displayIndexMinusOne) => (
            <AddressListItem
              key={address.id || JSON.stringify(address)}
              displayIndex={displayIndexMinusOne + 1}
              address={address}
              onEdit={() => setModalState({ type: 'edit', editingIndex: arrayIndex })}
              onRemove={() => removeAddress(arrayIndex)}
            />
          ))}
      </div>

      <button
        className={s.newAddressButton}
        type="button"
        onClick={() => setModalState({ type: 'add' })}
      >
        Add location
      </button>
    </li>
  );
};

EditAddresses.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  setAddresses: PropTypes.func.isRequired,
};

export default EditAddresses;
