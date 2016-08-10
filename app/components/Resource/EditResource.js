import React, { Component } from 'react';
import linkedState from 'react-link';
import Loader from '../Loader';
import EditServices from './EditServices';


class EditResource extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			resource: null,
			address_1: null
		};

		this.resource = null;

		this.renderServices = this.renderServices.bind(this);
		this.updateService = this.updateService.bind(this);
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
			phones: {
				number: "(415) 911-9111"
			},
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

	updateService(index, value) {
		let services = this.state.services;
		services[index].long_description = value;
		
		this.setState({ services: services });
		console.log(this.state);
	}

	renderServices() {
		let servicesArray = [];
		for(let i = 0; i < this.state.services.length; i++) {
			servicesArray.push(<EditServices key={i} index={i} service= {this.state.services[i]} onBlur={this.updateService} />);
		}

		return servicesArray;
	}

	render() {
		return ( !this.state.resource ? <Loader /> :
			<div>
				<div>Name</div>
				<textarea valueLink={linkedState(this, 'name')} />
				<div>Description</div>
				<textarea valueLink={linkedState(this, 'long_description')} />
				<div>Address</div>
				<textarea valueLink={linkedState(this, 'address_1')} />
				<div>City</div>
				<textarea valueLink={linkedState(this, 'city')} />
				<div>Country</div>
				<textarea valueLink={linkedState(this, 'country')} />
				<div>Postal Code</div>
				<textarea valueLink={linkedState(this, 'postal_code')} />
				<div>State/Province</div>
				<textarea valueLink={linkedState(this, 'state_province')} />
				<div>Phone Number</div>
				<textarea valueLink={linkedState(this, 'phone_number')} />
				<div>Website</div>
				<textarea valueLink={linkedState(this, 'website')} />
				<div>SERVICES</div>
				{this.renderServices()}
			</div>
		);
	}
}

export default EditResource;