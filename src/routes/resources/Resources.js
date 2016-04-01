import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Resources.scss';
import ResourcesTable from '../../components/ResourcesTable';

class Resources extends React.Component {
	constructor() {
		super();
		this.state = {categoryName: 'Category Name'};
		this.category = {};
	}

	loadCategoryFromServer() {
		//TODO: Once we have an API call to retrieve one category, set categoryName
		// let callback = function callback(response, textStatus, jqXHR) {
	 //      if (httpRequest.readyState === XMLHttpRequest.DONE) {
	 //        if (httpRequest.status === 200) {
	 //          this.category = JSON.parse(httpRequest.responseText);
	 //          console.log(this.category);
	 //          this.setState({categoryName: this.category.name});
	 //        } else {
	 //          console.log('error...');
	 //        }
	 //      }
	 //    }.bind(this);

	 //    let url = 'http://localhost:3000/categories?id=' + this.props.categoryid;
	 //    let httpRequest = new XMLHttpRequest();
	 //    httpRequest.open('GET', tempUrl, true);
	 //    httpRequest.onreadystatechange = callback;
	 //    httpRequest.send(null);

	 //    fetch(url).then(resp => resp.json())
		// .then(data => this.state.categoryName = data.name)
		// .catch(e => console.log("Error retrieving category"));
	}

	componentDidMount() {
		this.loadCategoryFromServer();
	}

	render() {
		return (
			<div className={styles.container}>
				<h1>{this.state.categoryName}</h1>
				<hr />
				<ResourcesTable categoryid={this.props.categoryid}/>
			</div>
		);
	}
}

export default withStyles(Resources, styles);