/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Resource.scss';
import {AddressInfo, BusinessHours, PhoneNumber, Website, Languages} from '../../components/Resource';

class Resource extends React.Component {
	constructor() {
		super();
		this.state = {resource: {}};
	}

	loadResourceFromServer() {
		let url = 'http://localhost:3000/resources/' + this.props.resource_id;
		fetch(url).then(r => r.json())
		.then(data => {
			this.setState({resource: data});
		})
		.catch(e => console.log("Error retrieving resource"));
	}

	componentDidMount() {
		this.loadResourceFromServer();
	}

	render() {
		return (
			<div className={styles.container}>
				<h1>{this.state.resource.name}</h1>
				<hr />
				<div className={styles.infocontainer}>
					<AddressInfo addresses={this.state.resource.addresses} />
					<BusinessHours schedule_days={this.state.resource.addresses} />
					<PhoneNumber phones={this.state.resource.phones} />
					<Website website={this.state.resource.website} />
					<Languages />
					<hr />
					<div className={styles.label}><p>Make Edits</p></div>
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

export default withStyles(Resource, styles);
