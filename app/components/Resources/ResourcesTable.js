import React, { Component } from 'react';
import { Link } from 'react-router';
import Gmap from './ResourcesMap.js';
import queryString from 'query-string';
import Loader from '../Loader';

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

  constructor(props) {
    super(props);
    this.state = {
      categoryName: 'Category Name',
      allResources: [],
      openResources: [],
      resources: null,
      openFilter: false,
      currentPage: [],
      page: 0,
      location: null
    };
  }

  loadResourcesFromServer(userLocation) {
    let { query } = this.props.location;
    let categoryId = query.categoryid;
    let searchQuery = query.query;

    let path = '/api/resources';
    let params = {};
    if(userLocation) {
      params.lat = userLocation.lat;
      params.long = userLocation.lng;
    }
    if (categoryId) {
      this.setState({
        categoryName: cats[categoryId]
      });
      params.category_id = categoryId;
    } else if (searchQuery) {
      path += '/search';
      params.query = searchQuery;
      this.setState({
        categoryName: 'Search: ' + searchQuery
      });
    }
    let url = path + '?' + queryString.stringify(params);
    fetch(url)
    .then(r => {
    	if(r.status == 200) {
    		return r.json();
    	} else {
    		throw "Error fetching: " + r.status
    	}
    })
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
    })
    .catch(err => {
    	console.error(err);
    	this.setState({
    		resources: []
    	});
    });
  }

  getNextResources() {
    let page = this.state.page + 1;
    let currentPage = this.state.resources.slice(page * resultsPerPage, page * resultsPerPage + (resultsPerPage));
    this.setState({
      page,
      currentPage
    });
  }

  getPreviousResources() {
    let page = this.state.page - 1;
    this.setState({
      page: page,
      currentPage: this.state.resources.slice(page * resultsPerPage, (page + 1) * resultsPerPage)
    });
  }

  getLocationGoogle() {
    // Results are not very accurate
    let url = 'https://www.googleapis.com/geolocation/v1/geolocate?key= AIzaSyBrt0fmU5Iarh0LdqEDp6bjMIqEOQB2hqU';
    return fetch(url, {method: 'post'})
      .then(r => {
      	if(r.status == 200) {
      	  return r.json();
      	} else {
      		throw "Error getting location from google " + r.status;
      	}
      })
      .then(data => {
        this.setState({location: data.location});
        return data.location;
      })
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
    if(this.state.openFilter) {
      this.setState({
        page: 0,
        resources: this.state.allResources,
        currentPage: this.state.allResources.slice(0, resultsPerPage),
        openFilter: false
      });
    } else {
      this.setState({
        page: 0,
        resources: this.state.openResources,
        currentPage: this.state.openResources.slice(0, resultsPerPage),
        openFilter: true
      });
    }
  }

  componentDidMount() {
    if(this.props.userLocation) {
      let position = this.props.userLocation;
      let userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
      this.setState({
        location: userLocation
      });
      this.loadResourcesFromServer(userLocation);
    } else {
      let self = this;
      this.getLocationGoogle()
        .then(loc => {
          self.loadResourcesFromServer(loc);
        })
        .catch(err => {
          console.log(err);
          self.loadResourcesFromServer(null);
        });
    }
  }

  render() {
    return !this.state.resources ? <Loader />
      : (<div className="results">
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
                  {this.state.resources && this.state.resources.length ? <p>{this.state.page * resultsPerPage + 1} — {Math.min(this.state.resources.length, (this.state.page + 1) * resultsPerPage)} Results</p> : <p>No results found</p>}
                </div>
                {this.state.page ? <button className="btn btn-link" onClick={this.getPreviousResources.bind(this)}> Previous </button> : null}
                {Math.floor(this.state.currentPage.length / resultsPerPage) && this.state.allResources.length !== (this.state.page + 1) * resultsPerPage ? <button className="btn btn-link" onClick={this.getNextResources.bind(this)}> Next </button> : null}
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
      dest: {lat: props.resource.address.latitude, lng: props.resource.address.longitude},
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
    let firstService = this.props.resource.services[0];
    let resourceDescription = this.props.resource.long_description ||
          this.props.resource.short_description ||
          (firstService && firstService.long_description);
    let hiddenStyle = {visibility: 'hidden'};
    return (
        <li className="results-table-entry">
          <Link to={{ pathname: "resource", query: { id: this.props.resource.id } }}>
          <div className="entry-photo-rating">
            <img className="entry-img" src={buildImgURL(this.props.resource.address)} />
            <div className="entry-rating excellent">
              <Rating ratings={this.props.resource.ratings} />
            </div>
          </div>
          <div className="entry-details">
            <h4 className="entry-title">{this.props.number}. {this.props.resource.name}</h4>
            <p className="entry-organization">{resourceDescription}</p>
            <p className="entry-meta">{buildAddressCell(this.props.resource.address)} &bull; {this.state.walkTime || "unknown"} walking</p>
            <Quote quote={this.props.resource.quote}/>
            <ul className="entry-actions" style={hiddenStyle}>
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

class Rating extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (this.props.ratings.length ?
      <div>
        <i className="material-icons">sentiment_very_satisfied</i>
        <span>{Math.round(this.props.ratings.reduce((total, rating) => {return total + rating}) / 5)}</span>
      </div> :
      null
    )
  }
}

class Quote extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let quote = this.props.quote;
    return (this.props.quote ?
      <div className="quote">
        <img className="quote-img" src={quote.url} />
        <div className="quote-content">
          <p className="quote-meta">{quote.username} • {quote.date}</p>
          <p className="quote-text">{quote.text}</p>
        </div>
      </div> :
      null
    )
  }
}

function getMapMarkers(resources, userLoc) {
  const processAddress = (resource) => {
    if(resource) {
      let address = resource.address;
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

function buildAddressCell(address) {
  let addressString = "";
  addressString += address.address_1;
  if(address.address_2) {
    addressString += ", " + address.address_2;
  }


  return <span>{addressString}</span>
}

function buildImgURL(address) {
  if(address) {
    return "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      address.latitude + "," + address.longitude +
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
