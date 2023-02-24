import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import editCollectionHOC from "./EditCollection";

class EditPhone extends Component<any, any> {
  constructor(props) {
    super(props);

    const { item } = this.props;

    this.state = {
      phone: _.clone(item),
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(e) {
    const { value } = e.target;
    const { field } = e.target.dataset;
    const { phone } = this.state;
    const { handleChange, index, item } = this.props;

    if (phone[field] || value !== item[field]) {
      phone[field] = value;
      this.setState({ phone });
      handleChange(index, phone);
    }
  }

  render() {
    const { index, item: phone } = this.props;
    const htmlID = `phonenumber${index}`;
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
          placeholder="ex. Fax, Voice, SMS"
          data-field="service_type"
          defaultValue={phone.service_type}
          onChange={this.handleFieldChange}
        />
      </li>
    );
  }
}

// Leaving propTypes definitions here for reference. Remove when we add proper
// TypeScript types to this component's props.
//
// EditPhone.propTypes = {
//   handleChange: PropTypes.func.isRequired,
//   index: PropTypes.number.isRequired,
//   item: PropTypes.shape({
//     country_code: PropTypes.string,
//     extension: PropTypes.string,
//     id: PropTypes.number,
//     number: PropTypes.string,
//     service_type: PropTypes.string,
//   }).isRequired,
// };

const EditPhones = editCollectionHOC(EditPhone, "Phones", {}, "Add Phone");
EditPhones.displayName = "EditPhones";
export default EditPhones;
