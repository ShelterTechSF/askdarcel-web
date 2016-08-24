import React, { Component } from 'react';
import linkedState from 'react-link';
import Loader from '../Loader';
import EditServices from './EditServices';
import EditPhones from './EditPhones';
import EditAddress from './EditAddress';


class EditResource extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			resource: null,
			address_1: null
		};

		this.resource = null;

		this.handleServicesChange = this.handleServicesChange.bind(this);
		this.handleFieldChange = this.handleFieldChange.bind(this);
		this.handleAddressChange = this.handleAddressChange.bind(this);
		this.handleNestedChange = this.handleNestedChange.bind(this);
		this.submitResource = this.submitResource.bind(this);
	}

	loadResourceFromServer() {
	    // let { query } = this.props.location;
	    // let resourceID = query.id;
	    // let url = '/api/resources/' + resourceID;
	    // fetch(url).then(r => r.json())
	    // .then(data => {
	    //   	this.setState({resource: data.resource});
	    // });
		let resource = {
			name: "Poops",
			long_description: "hella desribing bro",
			address: {
				address_1: "123 Fake St.",
				city: "San Francisco",
				country: "USA",
				postal_code: '12152-5338',
				state_province: "CA"
			},
			phones: [{
				number: "(415) 911-9111"
			}],
			website: "www.google.com",
			services: [
				{
					name: "Laundry",
					long_description: "meow meow meow"
				}
			]
		};

		this.resource = resource;
		this.setState({
			resource: resource,
			name: resource.name,
			long_description: resource.long_description,
			address_1: resource.address.address_1,
			city: resource.address.city,
			country: resource.address.country,
			postal_code: resource.address.postal_code,
			state_province: resource.address.state_province,
			phone_number: resource.phones.number,
			website: resource.website,
			services: resource.services
		});
  	}

	componentDidMount() {
		this.loadResourceFromServer();
	}

	

	handleFieldChange(e) {
		let resource = this.state.resource;
		resource[e.target.dataset.field] = e.target.value;
		this.setState({resource: resource});
	}

	handleAddressChange(address) {
		let resource = this.state.resource;
		resource.address = address;
		this.setState({resource: resource});
	}

	handleServicesChange(services) {
		let resource = this.state.resource;
		resource.services = services;
		this.setState({resource: resource});
	}

	handleNestedChange(field, obj) {
		let resource = this.state.resource;
		resource[field] = obj;
		this.setState({resource: resource});
	}

	submitResource() {
		console.log(this.state.resource);
	}

	render() {
		return ( !this.state.resource ? <Loader /> :
			<div>
				<button type='button' className='btn btn-primary' onClick={this.submitResource}>Meow</button>
				<div>Name</div>
				<textarea defaultValue={this.state.resource.name} data-field='name' onBlur={this.handleFieldChange} />
				<div>Long Description</div>
				<textarea defaultValue={this.state.resource.long_description} data-field='long_description' onBlur={this.handleFieldChange} />
				<div>Short Description</div>
				<textarea defaultValue={this.state.resource.short_description} data-field='short_description' onBlur={this.handleFieldChange} />
				<div>Website</div>
				<textarea defaultValue={this.state.resource.website} data-field='website' onBlur={this.handleFieldChange} />
				<EditPhones field='phones' phones={this.state.resource.phones} handlePhoneChange={this.handleNestedChange} />
				<EditServices field='services' services={this.state.resource.services} handleServiceChange={this.handleNestedChange} />
			</div>
		);
	}
}

export default EditResource;