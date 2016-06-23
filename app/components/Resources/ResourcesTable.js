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

const resultsPerPage = 9;

class ResourcesTable extends Component {
	constructor() {
		super();
		this.state = {
			categoryName: 'Category Name', 
			allResources: [],
			openResources: [],
			resources: [],
			openFilter: false,
			currentPage: [],
			page: 0,
			location: null
		};
	}

	loadResourcesFromServer() {
		let { query } = this.props.location;
		let categoryId = query.categoryid;
		this.setState({
			categoryName: cats[categoryId]
		});
		let url = '/api/resources?category_id=' + categoryId;
		fetch(url).then(r => r.json())
		.then(data => {
			let openResources = data.resources.filter(resource => {
				let hours = openHours(resource.schedule.schedule_days);
				if(hours) {
					return resource;
				}
			});
			this.setState({
				allResources: data.resources,
				resources: data.resources, 
				currentPage: data.resources.slice(0,resultsPerPage),
				openResources: openResources
			});
		});
	}

	getNextResources() {
		let page = this.state.page + 1;
		this.setState({
			page: page,
			currentPage: this.state.resources.slice(page * resultsPerPage, page * resultsPerPage + (resultsPerPage + 1))
		});
	}

	getPreviousResources() {
		let page = this.state.page - 1;
		let offset = page ? 1 : 0;
		this.setState({
			page: page,
			currentPage: this.state.resources.slice(page * resultsPerPage + offset, (page + 1) * resultsPerPage + offset)
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

	filterResources() {
		let page = 0;
		if(this.state.openFilter) {
			this.setState({
				page,
				resources: this.state.allResources,
				currentPage: this.state.allResources.slice(page, resultsPerPage),
				openFilter: false
			});
		} else {
			this.setState({
				page,
				resources: this.state.openResources,
				currentPage: this.state.openResources.slice(page, resultsPerPage),
				openFilter: true
			});
		}
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
                <span className="results-count">{this.state.allResources.length} Results</span>
              </header>
							<div className="results-filters">
								<ul>
									<li>Filter:</li>
									<li><a className="filters-button disabled" onClick={this.filterResources.bind(this)}>{this.state.openFilter ? "All" : "Open Now"}</a></li>
								</ul>
							</div>
              <div className="results-table-body">
                <ResourcesList resources={this.state.currentPage} location={this.state.location} page={this.state.page} />
                <div className="pagination">
                  <div className="pagination-count">
                    <p>{this.state.page * resultsPerPage + 1} — {(this.state.page + 1) * resultsPerPage < this.state.resources.length ? (this.state.page + 1) * resultsPerPage : this.state.resources.length} of {this.state.resources.length} Results</p>
                  </div>
                  {this.state.page ? <button className="btn btn-link" onClick={this.getPreviousResources.bind(this)}> Previous </button> : null}
                  {this.state.page <= Math.floor(this.state.resources.length / resultsPerPage) - 1 ? <button className="btn btn-link" onClick={this.getNextResources.bind(this)}> Next </button> : null}
                </div>
              </div>
						</div>
					<div className="map">
            <Gmap markers={getMapMarkers(this.state.currentPage, this.state.location)} />
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
				<ResourcesRow resource={resource} key={index} number={index + 1 + (resultsPerPage * this.props.page)} location={location || {}}/>
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
					  <img className="entry-img" src={buildImgURL(this.props.resource.addresses)} />
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

	let styles = {
		cell: true
	};

	let hours = openHours(schedule_days);

	if(!hours) {
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

function buildImgURL(addresses) {
	if(addresses.length) {
		return "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
		  addresses[0].latitude + "," + addresses[0].longitude +
		  "&fov=90&heading=235&pitch=10";
	} else {
		return "http://lorempixel.com/200/200/city/";
	}
}

// Returns the open hours today or null if closed
function openHours(scheduleDays) {
	const currentDate = new Date();
	const currentHour = currentDate.getHours();
	let hours = null;

	const days = scheduleDays.filter(scheduleDay => {
		let day = scheduleDay ? scheduleDay.day.replace(/,/g, '') : null;
		return (day && day === daysOfTheWeek()[currentDate.getDay()] &&
				currentHour > scheduleDay.opens_at && currentHour < scheduleDay.closes_at);
	});

	if(days.length) {
		for(let i = 0; i < days.length; i++) {
			let day = days[i];
			hours = "open: " + timeToString(day.opens_at) + "-" + timeToString(day.closes_at);
			if(i != days.length - 1) {
				hours += ", ";
			}
		}
	}

	return hours;
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
