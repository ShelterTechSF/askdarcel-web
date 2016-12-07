import React, { Component } from 'react';

class EditAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {address: this.props.address};
		this.handleBlur = this.handleBlur.bind(this);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
	}

	handleBlur(e) {
		let address = this.state.address;
		address[e.target.dataset.field] = e.target.value;

		this.setState({address: address});
		this.props.handleAddressChange('address', this.state.address);
	}

	handlePhoneChange(phones) {
		let address = this.state.address;
		address.phones = phones;

		this.setState({address: address});
		this.props.handleAddressChange(this.state.address);
	}

	render() {
		return (
			<div>
				<div>Address 1</div>
				<textarea defaultValue={this.props.address.address_1} data-field='address_1' onBlur={handleBlur} />
				<div>Address 2</div>
				<textarea defaultValue={this.props.address.address_2} data-field='address_2' onBlur={handleBlur} />
				<div>Address 3</div>
				<textarea defaultValue={this.props.address.address_3} data-field='address_3' onBlur={handleBlur} />
				<div>Address 4</div>
				<textarea defaultValue={this.props.address.address_4} data-field='address_4' onBlur={handleBlur} />
				<div>Attention</div>
				<textarea defaultValue={this.props.address.attention} data-field='attention' onBlur={handleBlur} />
				<div>City</div>
				<textarea defaultValue={this.props.address.city} data-field='city' onBlur={handleBlur} />
				<div>Country</div>
				<textarea defaultValue={this.props.address.country} data-field='country' onBlur={handleBlur} />
				<div>Postal Code</div>
				<textarea defaultValue={this.props.address.postal_code} data-field='postal_code' onBlur={handleBlur} />
				<div>State/Province</div>
				<textarea defaultValue={this.props.address.state_province} data-field='state_province' onBlur={handleBlur} />
			</div>
		);
	}
}
