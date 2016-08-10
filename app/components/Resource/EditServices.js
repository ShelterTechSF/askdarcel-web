import React, { Component } from 'react';
import Loader from '../Loader';

class EditServices extends Component {
	constructor(props) {
		super(props);
	}

	handleBlur(e) { 
		this.props.onBlur(this.props.index, e.target.value);
	}

	render() {
		return (
			<div>
				<div>{this.props.service.name}</div>
				<textarea defaultValue={this.props.service.long_description} onBlur={this.handleBlur.bind(this)} />
			</div>
		);
	}
}

export default EditServices;