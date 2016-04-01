import React from 'react';
import styles from './ResourcesTable.scss';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

let cx = classNames.bind(styles);

class ResourcesTable extends React.Component {
	constructor() {
		super();
		this.state = {categoryName: 'Category Name', resources: []};
	}

	loadResourcesFromServer() {
		let url = 'http://localhost:3000/resources?category_id=' + this.props.categoryid;
		fetch(url).then(r => r.json())
		.then(data => {
			this.setState({resources: data});
			console.log(this.state.resources);
		})
		.catch(e => console.log("Error retrieving resources"));
	}

	componentDidMount() {
		this.loadResourcesFromServer();
	}

	render() {
		return (
			<div className={styles.tablecontainer}>
				<div className={styles.preheader}><p>Select a resource:</p></div>
				<div className={styles.table}>
					<div className={styles.tableheader}>
						<div className={styles.row}>
							<div className={styles.cell}><p>Name</p></div>
							<div className={styles.cell}><p>Rating</p></div>
							<div className={styles.cell}><p>Todays hours</p></div>
							<div className={styles.cell}><p>Address</p></div>
							<div className={styles.cell}><p>Categories</p></div>
						</div>
					</div>
					<ResourcesList resources={this.state.resources} />
				</div>
			</div>
		);
	}
}

class ResourcesList extends React.Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {

		let resourcesRows = this.props.resources.map(resource => {
			return (
				<ResourcesRow resource={resource}/>	
			);
		});

		return (
			<div className={styles.tablebody}>
				{resourcesRows}
			</div>
		);
	}
}

class ResourcesRow extends React.Component {
	constructor() {
		super();
		this.state = {};
	}
	render() {
		let rowClass = cx({
			row: true
		});

		return (
			<div className={styles.row}>
				<div className={styles.cell}><p>{this.props.resource.name}</p></div>
				<div className={styles.cell}><p>{this.props.resource.rating}</p></div>
				<div className={styles.cell}><p>{this.props.resource.hours}</p></div>
				<div className={styles.cell}><p>{this.props.resource.address}</p></div>
				<div className={styles.cell}><p>{this.props.resource.categories}</p></div>
			</div>
		);
	}
}

export default withStyles(ResourcesTable, styles);