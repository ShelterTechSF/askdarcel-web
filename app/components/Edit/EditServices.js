import React, { Component } from 'react';
import Loader from '../Loader';

class EditServices extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.renderServices = this.renderServices.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
	}

	handleServiceChange(id, service) {
		let object = {};
		object[id] = service;
		this.setState(object, function() {
			this.props.handleServiceChange(this.state);
		});
	}

	renderServices() {
		let servicesArray = [];

		for(let i = 0; i < this.props.services.length; i++) {
			servicesArray.push(
				<EditService key={i} index={i} service={this.props.services[i]} handleChange={this.handleServiceChange} />
			);
		}

		return servicesArray;
	}

	render() {
		return (
			<li key="services" className="edit-section-item">
				{this.renderServices()}
			</li>
		);
	}
}

class EditService extends Component {
	constructor(props) {
		super(props);
		this.state = {
			service: {}
		};
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	handleFieldChange(e) {
		let service = this.state.service;
		service[e.target.dataset.field] = e.target.value;
		this.setState({service: service});

		this.props.handleChange(this.props.service.id, service);
	}

	render() {
		return (
			<div className="edit-service">
				<label>Service #{this.props.index+1}</label>
				<input placeholder='Name' data-field='name' defaultValue={this.props.service.name} onChange={this.handleFieldChange} />
				<textarea placeholder='Description' data-field='long_description' defaultValue={this.props.service.long_description} onChange={this.handleFieldChange} />
				<textarea placeholder='Eligibility' data-field='eligibility' defaultValue={this.props.service.eligibility} onChange={this.handleFieldChange} />
				<textarea placeholder='Application Process' data-field='application_process' defaultValue={this.props.service.application_process} onChange={this.handleFieldChange} />
				<input placeholder='Fee' data-field='fee' defaultValue={this.props.service.fee} onChange={this.handleFieldChange} />
				<textarea placeholder='Required Documents' data-field='required_documents' defaultValue={this.props.service.required_documents} onChange={this.handleFieldChange} />
			</div>
		);
	}
}

export default EditServices;
