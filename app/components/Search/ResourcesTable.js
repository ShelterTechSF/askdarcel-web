import React, { Component } from 'react';
import { Link } from 'react-router';
import Gmap from './ResourcesMap.js';
import queryString from 'query-string';
import ResourcesList from './ResourcesList'

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

    var path = '/api/resources';
    var params = {
      lat: userLocation.lat,
      long: userLocation.lng
    };
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
    let url = 'https://www.googleapis.com/geolocation/v1/geolocate';
    if(CONFIG.GOOGLE_API_KEY) {
      url += '?key=' + CONFIG.GOOGLE_API_KEY;
    }
    return fetch(url, {method: 'post'}).then(r => r.json())
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
        });
    }
  }

  render() {
    return !this.state.resources ? <div className="loader">
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
    </div> : (<div className="results">
                <div className="results-table">
                  <header>
                    <h1 className="results-title">{this.state.categoryName}</h1>
                    <span className="results-count">{this.state.allResources.length} Results</span>
                  </header>
                  <div className="results-filters">
                    <ul>
                      <li>Filter:</li>
                      <li><a className="filters-button" onClick={this.filterResources.bind(this)}>{this.state.openFilter ? "All" : "Open Now"}</a></li>
                    </ul>
                  </div>
                  <div className="results-table-body">
                    <ResourcesList resources={this.state.currentPage} location={this.state.location} page={this.state.page} resultsPerPage={resultsPerPage} />
                    <div className="add-resource">
                      <li className="results-table-entry">
                        <Link to={"ADD_PAGE"}>
                          <h4 className="entry-headline"><i className="material-icons">add_circle</i> Add a new resource</h4>
                        </Link>
                      </li>
                    </div>
                    <div className="pagination">
                      <div className="pagination-count">
                        {this.state.resources && this.state.resources.length ? <p>{this.state.page * resultsPerPage + 1} — {Math.min(this.state.resources.length, (this.state.page + 1) * resultsPerPage)} Results</p> : <p>No results found</p>}
                      </div>
                      {this.state.page ? <button className="btn btn-link" onClick={this.getPreviousResources.bind(this)}> Previous </button> : null}
                      {Math.floor(this.state.currentPage.length / resultsPerPage) && this.state.allResources.length !== (this.state.page + 1) * resultsPerPage ? <button className="btn btn-link" onClick={this.getNextResources.bind(this)}> Next </button> : null}
                    </div>
                  </div>
              </div>
              <div className="results-map">
              <Gmap markers={getMapMarkers(this.state.currentPage, this.state.location)} />
              </div>
            </div>
    );
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
    let url = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" +
      address.latitude + "," + address.longitude +
      "&fov=90&heading=235&pitch=10";
    if(CONFIG.GOOGLE_API_KEY) {
      url += '&key=' + CONFIG.GOOGLE_API_KEY;
    }
    return url;
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
