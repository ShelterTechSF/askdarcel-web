
import React, { PropTypes } from 'react';
import {AddressInfo, BusinessHours, PhoneNumber, Website, Languages} from './ResourceInfos';
import CommunicationBoxes from './CommunicationBoxes';
import Services from './Services.js';

class Resource extends React.Component {
	constructor() {
		super();
		this.state = {resource: {}};
	}

	loadResourceFromServer() {
		let { query } = this.props.location;
		let resourceID = query.id;
		let url = '/api/resources/' + resourceID;
		fetch(url).then(r => r.json())
		.then(data => {
			this.setState({resource: data});
		})
		;
	}

	componentDidMount() {
		this.loadResourceFromServer();
	}

	render() {
		return (
			<div className="resource_container">
				<h1>{this.state.resource.name}</h1>
				<hr />
                <CommunicationBoxes />
                <Services description={this.state.resource.long_description} services={this.state.resource.services}/>
				<div className="infocontainer">
					<AddressInfo addresses={this.state.resource.addresses} />
					<BusinessHours schedule_days={this.state.resource.addresses} />
					<PhoneNumber phones={this.state.resource.phones} />
					<Website website={this.state.resource.website} />
					<Languages />
					<hr />
					<div className="resource_editslabel"><p>Make Edits</p></div>
				</div>
			</div>
		);
	}
}

// Resource.propTypes = {
//   news: PropTypes.arrayOf(PropTypes.shape({
//     title: PropTypes.string.isRequired,
//     link: PropTypes.string.isRequired,
//     contentSnippet: PropTypes.string,
//   })).isRequired,
// };

export default Resource;
