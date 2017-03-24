import React, { Component } from 'react';
import Loader from '../Loader';
import EditNotes from './EditNotes';

class EditServices extends Component {
	constructor(props) {
		super(props);

		this.state = {
			services: {},
			existingServices: props.services.map((service) => {
				let newService = service;
				newService.key = service.id;
				return newService;
			}),
			uuid: -1
		};

		this.renderServices = this.renderServices.bind(this);
		this.handleServiceChange = this.handleServiceChange.bind(this);
		this.addService = this.addService.bind(this);
	}

	handleServiceChange(key, service) {
		let services = this.state.services;
		services[key] = service;
		this.setState({
			services: services
		}, function() {
			this.props.handleServiceChange(this.state);
		});
	}

	addService() {
		let existingServices = this.state.existingServices;
		let newUUID = this.state.uuid-1;
		existingServices.unshift({
			key: newUUID,
			notes: []
		});
		this.setState({existingServices: existingServices, uuid: newUUID});
	}

	renderServices() {
		let servicesArray = [];

		for(let i = 0; i < this.state.existingServices.length; i++) {
			let service = this.state.existingServices[i];
			servicesArray.push(
				<EditService key={service.key} index={i} service={service} handleChange={this.handleServiceChange} />
			);
		}

		return servicesArray;
	}

	render() {
		return (
			<div>
				<div className="title-container">
					<label>Services</label>
					<i className="material-icons" onClick={this.addService}>note_add</i>
				</div>
				<ul className="edit-section-item">
					{this.renderServices()}
				</ul>
			</div>
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
		this.handleNotesChange = this.handleNotesChange.bind(this);
		this.handleScheduleChange = this.handleScheduleChange.bind(this);
	}

	handleFieldChange(e) {
		let service = this.state.service;
		service[e.target.dataset.field] = e.target.value;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	handleNotesChange(notesObj) {
		let service = this.state.service;
		service.notesObj = notesObj;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	handleScheduleChange(scheduleObj) {
		let service = this.state.service;
		service.scheduleObj = scheduleObj;
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	render() {
		return (
			<li className="edit-service">
				<label>Service #{this.props.index+1}</label>
				<input placeholder='Name' data-field='name' defaultValue={this.props.service.name} onChange={this.handleFieldChange} />
				<textarea placeholder='Description' data-field='long_description' defaultValue={this.props.service.long_description} onChange={this.handleFieldChange} />
				<textarea placeholder='Eligibility' data-field='eligibility' defaultValue={this.props.service.eligibility} onChange={this.handleFieldChange} />
				<textarea placeholder='Application Process' data-field='application_process' defaultValue={this.props.service.application_process} onChange={this.handleFieldChange} />
				<input placeholder='Fee' data-field='fee' defaultValue={this.props.service.fee} onChange={this.handleFieldChange} />
				<textarea placeholder='Required Documents' data-field='required_documents' defaultValue={this.props.service.required_documents} onChange={this.handleFieldChange} />
				<EditNotes notes={this.props.service.notes} handleNotesChange={this.handleNotesChange} />
				
			</li>
		);
	}
}

export default EditServices;
