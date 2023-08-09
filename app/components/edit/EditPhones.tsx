import React, { Component } from "react";
import _ from "lodash";
import editCollectionHOC from "./EditCollection";
import type { InternalPhoneNumber } from "../../pages/OrganizationEditPage";

type Props = {
  item: InternalPhoneNumber;
  handleChange: (index: number, newPhone: InternalPhoneNumber) => void;
  index: number;
};

type State = {
  phone: InternalPhoneNumber;
};

class EditPhone extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { item } = this.props;

    this.state = {
      phone: _.clone(item),
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const { field } = e.target.dataset;
    const { phone } = this.state;
    const { handleChange, index, item } = this.props;

    if (field === undefined)
      throw new Error("Expected field to not be undefined");
    // This condition needs to be kept up to date with the `data-field`
    // attributes on the `<input>` tags rendered on this component.
    if (field !== "number" && field !== "service_type")
      throw new Error(
        "Expectied field to be either `number` or `service_type`"
      );

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

const EditPhones = editCollectionHOC(EditPhone, "Phones", {}, "Add Phone");
EditPhones.displayName = "EditPhones";
export default EditPhones;
