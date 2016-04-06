import React from 'react';
import styles from './ResourcesTable.scss';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Location from '../../core/Location';

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
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		//TODO: The Link class has a bunch of validations, etc. We should wrap that all in a service and just
		//call that.
		Location.push("/resource/" + this.props.resource.id);
	}

	render() {
		return (
			<div className={styles.row} onClick={this.handleClick}>
				<div className={styles.cell}><p>{this.props.resource.name}</p></div>
				<div className={styles.cell}><p>{Math.floor(Math.random()*10)%6}</p></div>
				{buildHoursCell(this.props.resource.schedule.schedule_days)}
				{buildAddressCell(this.props.resource.addresses)}
				<div className={styles.cell}><p>{this.props.resource.address}</p></div>
				<div className={styles.cell}><p>{this.props.resource.categories}</p></div>
			</div>
		);
	}
}

function buildHoursCell(schedule_days) {
	let hours = "";
	let styles = {
		cell: true
	};
	const currentDate = new Date();
	const currentHour = currentDate.getHours();

	const days = schedule_days.filter(schedule_day => {
		return (schedule_day && schedule_day.day == daysOfTheWeek()[currentDate.getDay()] &&
				currentHour > schedule_day.opens_at && currentHour < schedule_day.closes_at);
	});

	if(days.length && days.length > 0) {
		for(let i = 0; i < days.length; i++) {
			let day = days[i];
			hours = "open: " + timeToString(day.opens_at) + "-" + timeToString(day.closes_at);
			if(i != days.length - 1) {
				hours += ", ";
			}
		}
	} else {
		hours = "closed";
		styles.closed = true;
	}

	return (
		<div className={cx(styles)}><p>{hours}</p></div>
	);
}

function buildAddressCell(addresses) {
	let addressString = "";
	if(addresses.length && addresses.length > 0) {
		let address = addresses[0];
		addressString += address.address_1 + ", " + address.address_2;
	}

	return <div className={cx({cell: true})}><p>{addressString}</p></div>
}

function timeToString(hours) {
	let hoursString = "";
	if(hours < 12) {
		hoursString += hours + "am";
	} else {
		if(hours > 12) {
			hours -= 12;
		}
		
		hoursString += hours + "pm";
	}

	return hoursString;
}

function daysOfTheWeek() {
	return [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
}

export default withStyles(ResourcesTable, styles);