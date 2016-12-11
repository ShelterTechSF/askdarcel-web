import React, { Component } from 'react';

class EditAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {address: {}};
		this.handleAddressChange = this.handleAddressChange.bind(this);
	}

	handleAddressChange(e) {
		let field = e.target.dataset.field;
		let value = e.target.value;
		let address = this.state.address;
		address[field] = value;
		this.setState(address, function() {
			this.props.updateAddress(address);
		});
	}

	render() {
		let address = this.props.address;

		return (
			<li key="address" className="edit-section-item">
				<label>Address</label>
				<input type="text" placeholder="Address 1" data-field='address_1' defaultValue={address.address_1} onChange={this.handleAddressChange} />
				<input type="text" placeholder="Address 2" data-field='address_2' defaultValue={address.address_2} onChange={this.handleAddressChange} />
				<input type="text" placeholder="Address 3" data-field='address_3' defaultValue={address.address_3} onChange={this.handleAddressChange} />
				<input type="text" placeholder="Address 4" data-field='address_4' defaultValue={address.address_4} onChange={this.handleAddressChange} />
				<input type="text" placeholder="City" data-field='city' defaultValue={address.city} onChange={this.handleAddressChange} />
				<input type="text" placeholder="State/Province" data-field='state_province' defaultValue={address.state_province} onChange={this.handleAddressChange} />
				<input type="text" placeholder="Country" data-field='country' defaultValue={address.country} onChange={this.handleAddressChange} />
				<input type="text" placeholder="Postal/Zip Code" data-field='posta_code' defaultValue={address.postal_code} onChange={this.handleAddressChange} />
			</li>
		);
	}
}

export default EditAddress;
