import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';

import Navigation from './ui/Navigation';
// import CategoryPage from './Find/FindPage';
// import ResourcesTable from './Search/ResourcesTable';
import { round } from '../utils/index';
import userActions from '../actions/userActions';


class App extends Component {

  /**
   * Get user location.
   *
   * Makes use of both the HTML5 Geolocation API and the Google Maps Geolocation
   * API. Currently restricts the location to within San Francisco to avoid
   * inaccurate geolocation results, but this should be removed if more locations
   * are added.
   *
   * @returns A Promise of a location, which is either an object with `lat` and
   * `lng` properties or an error if location is unavaible or out of bounds.
   */
  getLocation() {
    return new Promise((resolve, reject) => {
      this.getLocationBrowser()
        .then(resolve)
        .catch(e => {
          this.getLocationGoogle()
            .then(resolve)
            .catch(reject);
        });
    });
  }

  coordsInSanFrancisco(coords) {
    // These are conservative bounds, extending into the ocean, the Bay, and Daly
    // City.
    let bb = {
      top: 37.820633,
      left: -122.562447,
      bottom: 37.688167,
      right: -122.326927
    };
    return coords.lat > bb.bottom &&
      coords.lat < bb.top &&
      coords.lng > bb.left &&
      coords.lng < bb.right;
  }

  /**
   * Get location via HTML5 Geolocation API.
   */
  getLocationBrowser() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          let coords = {
            lat: round(position.coords.latitude, 4),
            lng: round(position.coords.longitude, 4)
          };
          if (this.coordsInSanFrancisco(coords)) {
            resolve(coords);
          } else {
            let msg = "User location out of bounds: " + coords.lat + ", " + coords.lng;
            console.log(msg);
            reject(msg);
          }
        }, error => {
          console.log(error);
          reject(error);
        });
      } else {
        let msg = "Geolocation is not supported by this browser."
        console.log(msg);
        reject(msg);
      }
    }, {timeout: 10000});
  }

  /**
   * Get location via the Google Maps Geolocation API.
   */
  getLocationGoogle() {
    return new Promise((resolve, reject) => {
      // Results are not very accurate
      let url = 'https://www.googleapis.com/geolocation/v1/geolocate';
      if(CONFIG.GOOGLE_API_KEY) {
        url += '?key=' + CONFIG.GOOGLE_API_KEY;
      }
      return fetch(url, {method: 'post'}).then(r => r.json())
        .then(data => {
          if (this.coordsInSanFrancisco(data.location)) {
            resolve(data.location);
          } else {
            let msg = "User location out of bounds";
            console.log(msg);
            reject(msg);
          }
        })
        .catch(reject);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      userLocation: null
    };
  }

  componentDidMount() {
    this.getLocation().then(coords => {
      this.props.setUserLocation(coords);
      this.setState({
        userLocation: coords
      });
    }).catch(e => {
      console.log("Could not obtain location, defaulting to San Francisco.");
      console.log(e);
      this.props.setUserLocation({ lat: 37.7749, lng: -122.4194 })
      this.setState({
        // HACK: Hardcode middle of San Francisco
        userLocation: {
          lat: 37.7749,
          lng: -122.4194
        }
      });
    });
  }

  render() {
    let childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        userLocation: this.state.userLocation,
      });
    });

    return (
      <div>
        <Navigation />
        <div className="container">
          {childrenWithProps}
        </div>
      </div>
    )
  }

};

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserLocation: (location) => dispatch(userActions.setUserLocation(location)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps) (App);
