import React, { Component } from 'react';
import Loader from '../Loader';

class EditServices extends Component {
	constructor(props) {
		super(props);

		this.state = {services: this.props.services};

		this.renderServices = this.renderServices.bind(this)
	}

	handleServiceChange(index, service) {
		let services = this.state.services;
		services[index] = service;
		this.setState({services: services});

		this.handleServiceChange(this.props.field, services);
	}

	renderServices() {
		let servicesArray = [];
		let services = this.state.services;
		for(let i = 0; i < this.state.services.length; i++) {
			servicesArray.push(
				<EditService key={i} index={i} service={this.state.services[i]} handleChange={this.handleServiceChange} />
			);
		}

		return servicesArray;
	}

	render() {
		return (
			<div>
				{this.renderServices()}
			</div>
		);
	}
}

class EditService extends Component {
	constructor(props) {
		super(props);
		this.state = ({service: this.props.service});
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	handleFieldChange(e) {
		let service = this.state.service;
		service[e.target.dataset.field] = e.target.value;
		this.setState({service: service});

		this.props.handleChange(this.props.index, service);
	}

	render() {
		return (
			<div>
				<div>Service #{this.props.index+1}</div>
				<div>Name</div>
				<textarea data-field='name' defaultValue={this.props.service.name} onBlur={this.handleFieldChange} />
				<div>Long Description</div>
				<textarea data-field='long_description' defaultValue={this.props.service.long_description} onBlur={this.handleFieldChange} />
				<div>Eligibility</div>
				<textarea data-field='eligibility' defaultValue={this.props.service.eligibility} onBlur={this.handleFieldChange} />
			</div>
		);
	}
}

export default EditServices;