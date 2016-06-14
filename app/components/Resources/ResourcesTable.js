import React, { Component } from 'react';
import { Link } from 'react-router';
import Gmap from './Map.js';

// Show the span of results (11 - 20 for example rather than the #10)
// Make the map update with proper markers

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
		this.state = {
			categoryName: 'Category Name',
			resources: [],
			currentResources: [],
			page: 0,
			location: null
		};
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
			this.setState({resources: data.resources, currentResources: data.resources.slice(0,9)});
		});
	}

	getNextResources() {
		let page = this.state.page + 1;
		this.setState({
			page: page,
			currentResources: this.state.resources.slice(page, page + 9)
		});
	}

	getPreviousResources() {
		let page = this.state.page - 1;
		this.setState({
			page: page,
			currentResources: this.state.resources.slice(page, page + 9)
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
		return !this.state.resources.length || !this.state.location ? <div className="loader">
      <div className="sk-fading-circle">
        <div className="sk-circle1 sk-circle"></div>
        <div className="sk-circle2 sk-circle"></div>
        <div className="sk-circle3 sk-circle"></div>
        <div className="sk-circle4 sk-circle"></div>
        <div className="sk-circle5 sk-circle"></div>
        <div className="sk-circle6 sk-circle"></div>
        <div className="sk-circle7 sk-circle"></div>
        <div className="sk-circle8 sk-circle"></div>
        <div className="sk-circle9 sk-circle"></div>
        <div className="sk-circle10 sk-circle"></div>
        <div className="sk-circle11 sk-circle"></div>
        <div className="sk-circle12 sk-circle"></div>
      </div>
    </div> : (
			<div className="results">
						<div className="results-table">
							<header>
                <h1 className="results-title">{this.state.categoryName}</h1>
                <span className="results-count">{this.state.resources.length} Results</span>
              </header>
							<div className="results-filters">
								<ul>
									<li>Filter:</li>
									<li><a className="filters-button disabled">Open Now</a></li>
								</ul>
							</div>
              <div className="results-table-body">
                <ResourcesList resources={this.state.currentResources} location={this.state.location} />
                <div className="pagination">
                  <div className="pagination-count">
                    <p>1 — 9 of 22 Results</p>
                  </div>
                  {this.state.page ? <button className="btn btn-link" onClick={this.getPreviousResources.bind(this)}> Previous </button> : null}
                  {this.state.page <= Math.floor(this.state.resources.length / 9) - 1 ? <button className="btn btn-link" onClick={this.getNextResources.bind(this)}> Next </button> : null}
                </div>
              </div>
						</div>
					<div className="map">
            <Gmap markers={getMapMarkers(this.state.currentResources, this.state.location)} />
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
      <ul className="resource-table-entries">
        {resourcesRows}
      </ul>
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
		var num = this.props.number;
		this.getWalkTime(this.state.dest, (duration) => {
			this.setState({
				walkTime: duration
			});
		});
	}

	render() {
		return (
			<li className="results-table-entry">
				<Link to={{ pathname: "resource", query: { id: this.props.resource.id } }}>
					<div className="entry-photo-rating">
					  <img className="entry-img" src="http://lorempixel.com/100/100/city/" />
            <div className="entry-rating excellent">
              <i className="material-icons">sentiment_very_satisfied</i>
              <span>{Math.floor(Math.random()*10)%6}</span>
            </div>
          </div>
          <div className="entry-details">
            <h4 className="entry-title">{this.props.number}. {this.props.resource.short_description || this.props.resource.long_description || "Description"}</h4>
            <p className="entry-organization">{this.props.resource.name}</p>
            <p className="entry-meta">{buildAddressCell(this.props.resource.addresses)} &bull; {this.state.walkTime || "unknown"} walking</p>
            <div className="quote">
              <img className="quote-img" src="http://lorempixel.com/100/100/people/" />
              <div className="quote-content">
                <p className="quote-meta">username • April 22, 2016</p>
                <p className="quote-text">they were nice and helpful</p>
              </div>
            </div>
            <ul className="entry-actions">
              <li>
                <div className="button">
                  <i className="material-icons">turned_in</i>
                  <span>Save</span>
                </div>
              </li>
            </ul>
          </div>
				</Link>
			</li>
		);
	}
}

function getMapMarkers(resources, userLoc) {
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

	var markers = {};

	markers.results = resources.map(resource => {
		return processAddress(resource);
	});

	markers.user = userLoc;

	return markers;
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
