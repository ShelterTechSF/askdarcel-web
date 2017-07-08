import React, { Component } from 'react';
import Loader from '../Loader';
import EditNotes from './EditNotes';
import EditSchedule from './EditSchedule';
import { createTemplateSchedule } from '../../utils/index';

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
			notes: [],
			schedule: {
				schedule_days: createTemplateSchedule()
			}
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
			<li className="edit--section--list--item">
			<button className="edit--section--list--item--button" onClick={this.addService}><i className="material-icons">add_box</i>Add Service</button>
				<ul className="edit--section--list--item--sublist edit--service--list">
					{this.renderServices()}
				</ul>
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

	handleScheduleChange(scheduleObj, inheritSchedule) {
		let service = this.state.service;
		if(scheduleObj !== null) {
			service.scheduleObj = scheduleObj;
		}

		if(inheritSchedule !== null) {
			service.inherit_schedule = inheritSchedule;
		}
		
		this.setState({service: service});
		this.props.handleChange(this.props.service.key, service);
	}

	render() {
		return (
			<li className="edit--service edit--section">
				<header className="edit--section--header">
      				<h4>Service {this.props.index+1}: {this.props.service.name}</h4>
      			</header>

				<ul className="edit--section--list">
					<li className="edit--section--list--item">
						<label>Service name</label>
						<input placeholder='Name' data-field='name' defaultValue={this.props.service.name} onChange={this.handleFieldChange} />
					</li>

					<li key="email" className="edit--section--list--item email">
						<label>Service E-Mail</label>
						<input type="url" defaultValue={this.props.service.email} data-field='email' onChange={this.handleFieldChange}/>
					</li>

					<li className="edit--section--list--item">
						<label>Service description</label>
						<textarea placeholder='Description' data-field='long_description' defaultValue={this.props.service.long_description} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>How do you apply for this service</label>
						<textarea placeholder='Application Process' data-field='application_process' defaultValue={this.props.service.application_process} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>Who is eligible for this service</label>
						<textarea placeholder='Eligibility' data-field='eligibility' defaultValue={this.props.service.eligibility} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>How much does this service cost</label>
						<input placeholder='Fee' data-field='fee' defaultValue={this.props.service.fee} onChange={this.handleFieldChange} />
					</li>

					<li className="edit--section--list--item">
						<label>What documents do you need to bring to apply</label>
						<textarea placeholder='Required Documents' data-field='required_documents' defaultValue={this.props.service.required_documents} onChange={this.handleFieldChange} />
					</li>

					<EditSchedule schedule={this.props.service.schedule} inheritSchedule={true} inheritable={true} handleScheduleChange={this.handleScheduleChange} />

					<EditNotes notes={this.props.service.notes} handleNotesChange={this.handleNotesChange} />
				</ul>
			</li>
		);
	}
}

export default EditServices;
