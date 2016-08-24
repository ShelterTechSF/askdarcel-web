import React, { Component } from 'react';

class EditPhones extends Component {
	constructor(props) {
		super(props);
		this.handlePhoneChange = this.handlePhoneChange.bind(this);
		this.renderPhones = this.renderPhones.bind(this);
		this.state = {phones: this.props.phones};
	}

	handlePhoneChange(index, phone) {
		let phones = this.state.phones;
		phones[index] = phone;
		this.setState({phones: phones});
		this.props.handlePhoneChange(this.props.field, phones);
	}

	renderPhones() {
		let phoneElements = [];
		let phones = this.state.phones;
		for(let i = 0; i < phones.length; i++) {
			phoneElements.push(
				<EditPhone key={i} index={i} phone={phones[i]} handlePhoneChange={this.handlePhoneChange} />
			);
		}

		return phoneElements;	
	}

	render() {
		return (
			<div>
				{this.renderPhones()}
			</div>
		)
	}
}

class EditPhone extends Component {
	constructor(props) {
		super(props);
		this.state = {phone: this.props.phone};
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleBlur(e) {
		let phone = this.state.phone;
		phone[e.target.dataset.field] = e.target.value;
		this.setState({phone: phone});

		this.props.handlePhoneChange(this.props.index, this.state.phone);
	}

	render() {
		return(
			<div>
				<div>Phone #{this.props.index+1}</div>
				<div>Number</div>
				<textarea defaultValue={this.props.phone.number} data-field='number' onBlur={this.handleBlur} />
				<div>Extension</div>
				<textarea defaultValue={this.props.phone.extension} data-field='extension' onBlur={this.handleBlur} />
				<div>Country Code</div>
				<textarea defaultValue={this.props.phone.country_code} data-field='country_code' onBlur={this.handleBlur} />
				<div>Service Type</div>
				<textarea defaultValue={this.props.phone.service_type} data-field='service_type' onBlur={this.handleBlur} />
			</div>
		);
	}
}

export default EditPhones;
