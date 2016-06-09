import React, { Component } from 'react';
import { Link } from 'react-router';
import Gmap from './Map.js';

const cats = {
	1: "Shelter",
	2: "Food",
	3: "Medical",
	4: "Hygiene",
	5: "Technology"
};

class ResourcesTable extends Component {
	constructor() {
		super();
		this.state = {categoryName: 'Category Name', resources: [], location: null};
	}

	loadResourcesFromServer() {
		let { query } = this.props.location;
		let categoryid = query.categoryid;
		this.setState({
			categoryName: cats[categoryid]
		});
		let url = '/api/resources?category_id=' + categoryid;
		fetch(url).then(r => r.json())
		.then(data => {
			this.setState({resources: data.resources});
		});
	}

	getLocationGoogle() {
		// Results are not very accurate
		let url = 'https://www.googleapis.com/geolocation/v1/geolocate?key= AIzaSyBrt0fmU5Iarh0LdqEDp6bjMIqEOQB2hqU'; 
		fetch(url, {method: 'post'}).then(r => r.json())
		.then(data => {
			this.setState({location: data.location});
		});
	}

	getWalkTime(dest, cb) {
		let directionsService = new google.maps.DirectionsService();
		let myLatLng = new google.maps.LatLng(this.state.location.lat, this.state.location.lng);
		let destLatLang = new google.maps.LatLng(dest.lat, dest.lng);
		let preferences = {
			origin: myLatLng,
			destination: destLatLang,
			travelMode: google.maps.TravelMode.WALKING
		};
		directionsService.route(preferences, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      cb(result.routes[0].legs[0].duration.text);
	    }
	  });
	}

	componentDidMount() {
		if(this.props.userLocation) {
			let position = this.props.userLocation;
			let userPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
			this.setState({
				location: userPosition
			});
		} else {
			this.getLocationGoogle();
			// this.props.getLocation(position => {
			// 	let userPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
			// 	console.log("got it!", userPosition);
			// 	this.setState({
			// 		location: userPosition
			// 	});
		 //  },
		 //  error => {
		 //  	console.error(error);
		 //  });
		}

		this.loadResourcesFromServer();
		
	}

	render() {
		return !this.state.resources.length || !this.state.location ? <div>Loading...</div> : (
			<div className="resourcetable_main">
			  <div className="row">
					<div className="col-xs-12 col-md-5">
						<div className="resourcetable_main container-fluid">
							<div className="resourcetable_preheader row">
							  <p className="resourcetable_title col-md-10">{this.state.categoryName}</p>
							  <span className="col-md-2">{this.state.resources.length} Results</span>
							</div>
							<div className="resourcetable_filter">
								<ul className="list-inline">
									<li>Filter:</li>
									<li>Open Now</li>
									<li>Walking Distance</li>
									<li>Just for Me</li>
								</ul>
							</div>
							<ResourcesList resources={this.state.resources} location={this.state.location} />
						</div>
					</div>
					<div className="resourcetable_main container-fluid">
						<div className="resourcetable_map col-xs-12 col-md-7">
						  {getMapWithMarkers(this.state.resources, this.state.location)}
						</div>
				  </div>
				</div>
			</div>
		);
	}
}

class ResourcesList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let location = this.props.location;
		let resourcesRows = this.props.resources.map((resource, index) => {
			return (
				<ResourcesRow resource={resource} key={index} number={index + 1} location={location || {}}/>	
			);
		});

		return (
			<div className="resourcetable_tablebody">
				{resourcesRows}
			</div>
		);
	}
}

class ResourcesRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dest: {lat: props.resource.addresses[0].latitude, lng: props.resource.addresses[0].longitude},
			walkTime: null
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		//TODO: The Link class has a bunch of validations, etc. We should wrap that all in a service and just
		//call that.
		// Location.push("/resource/" + this.props.resource.id);
	}

	getWalkTime(dest, cb) {
		let directionsService = new google.maps.DirectionsService();
		let myLatLng = new google.maps.LatLng(this.props.location.lat, this.props.location.lng);
		let destLatLang = new google.maps.LatLng(dest.lat, dest.lng);
		let preferences = {
			origin: myLatLng,
			destination: destLatLang,
			travelMode: google.maps.TravelMode.WALKING
		};
		directionsService.route(preferences, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      cb(result.routes[0].legs[0].duration.text);
	    }
	  });
	}

	getReview() {
		let placeHolderReviews = [
		  "safe and friendly",
		  "clean place",
		  "great if you can get in",
		  "okay",
		  "not the best"
		];

		return placeHolderReviews[Math.floor(Math.random() * placeHolderReviews.length)];
	}

	componentDidMount() {
		this.getWalkTime(this.state.dest, (duration) => {
			this.setState({
				walkTime: duration
			});
		});
	}

	render() {
		return !this.state.walkTime ? <div>Loading...</div> : (
			<div className="resourcetable_entry">
				<Link to={{ pathname: "resource", query: { id: this.props.resource.id } }}>
					<div className="row">
					  <img className="col-md-3" src="http://lorempixel.com/100/100/city/" />
					  <div className="resourcetable_general_info col-md-6">
							<div className="resourcetable_name"><p>{this.props.number}. {this.props.resource.short_description || this.props.resource.long_description || "Description"}</p></div>
							<div className="resourcetable_address">
								<p>{this.props.resource.name}</p>
							  <p>{buildAddressCell(this.props.resource.addresses)} &bull; {this.state.walkTime} walking</p>
							</div>
							<div><button>Save</button></div>
					  </div>
						<div className="resourcetable_reviewbox col-md-2 text-center"><p>{Math.floor(Math.random()*10)%6}</p></div>
				  </div>
					<div className="resourcetable_subtext">
					  <p><span className="glyphicon glyphicon-bell"></span> {buildHoursCell(this.props.resource.schedule.schedule_days)}</p>
						<p><span className="glyphicon glyphicon-comment"></span> {this.getReview()}</p>
					</div>
				</Link>
			</div>
		);
	}
}

function getMapWithMarkers(resources, userLoc) {
	const processAddress = (resource) => {
		if(resource) {
			let address = resource.addresses[0];
			if(!address) {
				return null;
			}
			return [+address.latitude, +address.longitude];
		}
		return null;
	};

	let markers = {
		center: processAddress(resources[0])
	};
	markers.additional = resources.slice(1).map(resource => {
		return processAddress(resource);
	});
	markers.user = userLoc;

	return <Gmap markers={markers} />;
}

function displayCategories(categories) {
    let categoryNames = categories.map(category => category.name);
    let categoryString = '';
    categoryNames.forEach(category => categoryString += category + ', ');

    return categoryString.substr(0, categoryString.length-2);
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
		<span className="resourcetable_hours">{hours}</span>
	);
}

function buildAddressCell(addresses) {
	let addressString = "";
	if(addresses.length && addresses.length > 0) {
		let address = addresses[0];
		addressString += address.address_1;
		if(address.address_2) {
			addressString += ", " + address.address_2;
		}
	}

	return <span>{addressString}</span>
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

export default ResourcesTable;