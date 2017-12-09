import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import editCollectionHOC from './EditCollection';

class EditPhone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: _.clone(this.props.item),
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(e) {
    const value = e.target.value;
    const field = e.target.dataset.field;
    const phone = this.state.phone;

    if (phone[field] || value !== this.props.item[field]) {
      phone[field] = value;
      this.setState({ phone });
      this.props.handleChange(this.props.index, phone);
    }
  }

  render() {
    const phone = this.props.item;
    const htmlID = `phonenumber${this.props.index}`;
    return (
      <li key="tel" className="edit--section--list--item tel">
        <label htmlFor={htmlID}>Telephone</label>
        <input
          id={htmlID}
          type="tel"
          className="input"
          placeholder="Phone number"
          data-field="number"
          defaultValue={phone.number}
          onChange={this.handleFieldChange}
        />
        <input
          type="tel"
          className="input"
          placeholder="Service type"
          data-field="service_type"
          defaultValue={phone.service_type}
          onChange={this.handleFieldChange}
        />
      </li>
    );
  }
}

EditPhone.propTypes = {
  handleChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    country_code: PropTypes.string,
    extension: PropTypes.string,
    id: PropTypes.number,
    number: PropTypes.string,
    service_type: PropTypes.string,
  }).isRequired,
};

const EditPhones = editCollectionHOC(EditPhone, 'Phones', {}, false);
EditPhones.displayName = 'EditPhones';
export default EditPhones;
