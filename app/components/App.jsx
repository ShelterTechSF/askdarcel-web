import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Intercom from 'react-intercom';
import { connect } from 'react-redux';
import Banner from './ui/Banner/Banner';
import Navigation from './ui/Navigation/Navigation';
// import CategoryPage from './find/FindPage';
// import ResourcesTable from './search/ResourcesTable';
import { round } from '../utils/index';
import { getSiteTitle, getSiteUrl, isSFFamiliesSite } from '../utils/whitelabel';
import 'react-select/dist/react-select.css';
import config from '../config';
import HamburgerMenu from './ui/HamburgerMenu';
import PopUpMessage from './ui/PopUpMessage';
import UserWay from './ui/UserWay';
import { User } from '../models';
import Routes from '../routes';
import MetaImage from '../assets/img/sfsg-preview.png';

const coordsInSanFrancisco = coords => {
  // These are conservative bounds, extending into the ocean, the Bay, and Daly
  // City.
  const bb = {
    top: 37.820633,
    left: -122.562447,
    bottom: 37.688167,
    right: -122.326927,
  };
  return coords.lat > bb.bottom
    && coords.lat < bb.top
    && coords.lng > bb.left
    && coords.lng < bb.right;
};

/**
 * Get location via HTML5 Geolocation API.
 */
const getLocationBrowser = () => new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const coords = {
        lat: round(position.coords.latitude, 4),
        lng: round(position.coords.longitude, 4),
      };
      if (coordsInSanFrancisco(coords)) {
        resolve(coords);
      } else {
        const msg = `User location out of bounds: ${coords.lat},${coords.lng}`;
        console.log(msg);
        reject(msg);
      }
    }, error => {
      console.log(error);
      reject(error);
    });
  } else {
    const msg = 'Geolocation is not supported by this browser.';
    console.log(msg);
    reject(msg);
  }
}, { timeout: 10000 });

/**
 * Get location via the Google Maps Geolocation API.
 */
const getLocationGoogle = () => new Promise((resolve, reject) => {
  // Results are not very accurate
  let url = 'https://www.googleapis.com/geolocation/v1/geolocate';
  if (config.GOOGLE_API_KEY) {
    url += `?key=${config.GOOGLE_API_KEY}`;
  }
  return fetch(url, { method: 'post' }).then(r => r.json())
    .then(data => {
      if (coordsInSanFrancisco(data.location)) {
        resolve(data.location);
      } else {
        const msg = 'User location out of bounds';
        console.log(msg);
        reject(msg);
      }
    })
    .catch(reject);
});

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
const getLocation = () => new Promise((resolve, reject) => {
  getLocationBrowser()
    .then(resolve)
    .catch(() => {
      getLocationGoogle()
        .then(resolve)
        .catch(reject);
    });
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hamburgerMenuIsOpen: false,
    };
    this.toggleHamburgerMenu = this.toggleHamburgerMenu.bind(this);
    this.onHamburgerMenuStateChange = this.onHamburgerMenuStateChange.bind(this);
  }

  componentDidMount() {
    const { setUserLocation } = this.props;
    getLocation().then(coords => {
      setUserLocation(coords);
    }).catch(e => {
      console.log('Could not obtain location, defaulting to San Francisco.', e);
      // HACK: Hardcode middle of San Francisco
      const userLocation = { lat: 37.7749, lng: -122.4194 };
      setUserLocation(userLocation);
    });
  }

  onHamburgerMenuStateChange(state) {
    this.setState({ hamburgerMenuIsOpen: state.isOpen });
  }

  toggleHamburgerMenu() {
    this.setState(state => ({ hamburgerMenuIsOpen: !state.hamburgerMenuIsOpen }));
  }

  render() {
    const { hamburgerMenuIsOpen } = this.state;

    const outerContainerId = 'outer-container';
    const pageWrapId = 'page-wrap';
    const siteTitle = getSiteTitle();
    const siteUrl = getSiteUrl();
    return (
      <div id={outerContainerId}>
        <Helmet>
          <title>{siteTitle}</title>
          <meta property="og:url" content={siteUrl} />
          <meta property="og:title" content={siteTitle} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@sheltertechorg" />
          <meta property="og:description" content="Get guided help finding food, housing, health resources and more in San Francisco" />
          <meta property="og:image" content={MetaImage} />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Helmet>
        {!isSFFamiliesSite()
          && config.INTERCOM_APP_ID
          && <Intercom appID={config.INTERCOM_APP_ID} />}
        {isSFFamiliesSite()
          && <UserWay appID={config.SFFAMILIES_USERWAY_APP_ID} />}
        <HamburgerMenu
          isOpen={hamburgerMenuIsOpen}
          outerContainerId={outerContainerId}
          onStateChange={this.onHamburgerMenuStateChange}
          pageWrapId={pageWrapId}
          toggleHamburgerMenu={this.toggleHamburgerMenu}
        />
        <div id={pageWrapId}>
          <Navigation
            showSearch={!isSFFamiliesSite()}
            toggleHamburgerMenu={this.toggleHamburgerMenu}
          />
          {!isSFFamiliesSite() && <Banner />}
          <div className="container">
            <Routes />
          </div>
          <PopUpMessage />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUserLocation: location => dispatch(User.setUserLocation(location)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(hot(App));
