import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import { images } from 'assets';
import { daysOfTheWeek } from 'utils';
import Loader from 'components/ui/Loader';
import { ResourcesList } from 'components/search';
import { Gmap } from 'components/maps';

// Show the span of results (11 - 20 for example rather than the #10)
// Make the map update with proper markers

const cats = {
  1: 'Shelter',
  2: 'Food',
  3: 'Medical',
  4: 'Hygiene',
  5: 'Technology',
};

const resultsPerPage = 9;

function getTimes(scheduleDays) {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const currentTime = parseInt(moment().format('hhmm'), 10);
  let openUntil = null;
  // Logic to determine if the current resource is open
  // includes special logic for when a resource is open past midnight
  // on the previous day
  scheduleDays.forEach((scheduleDay) => {
    const day = scheduleDay ? scheduleDay.day.replace(/,/g, '') : null;
    const opensAt = scheduleDay.opens_at;
    const closesAt = scheduleDay.closes_at;

    if (day) {
      if (day === daysOfTheWeek()[currentDate.getDay()]) {
        if (currentTime > opensAt && currentTime < closesAt) {
          openUntil = closesAt;
        }
      }

      if (day === daysOfTheWeek()[yesterday.getDay()] && closesAt < opensAt) {
        if (currentTime < closesAt) {
          openUntil = closesAt;
        }
      }
    }
  });

  if (openUntil) {
    return { openUntil, isOpen: true };
  }
  return { openUntil, isOpen: false };
}

function getMapMarkers(resources, userLoc) {
  const processAddress = (resource) => {
    if (resource) {
      const address = resource.address;
      if (!address) {
        return null;
      }
      return [+address.latitude, +address.longitude];
    }
    return null;
  };

  const markers = {};

  markers.results = resources.map(resource => processAddress(resource));

  markers.user = userLoc;

  return markers;
}

function prepOpenResources(resources) {
  const preparedOpenResources = [];

  resources.forEach((r) => {
    const resource = r;
    const { openUntil, isOpen } = getTimes(resource.schedule.schedule_days);
    resource.openUntil = openUntil;
    resource.isOpen = isOpen;

    if (isOpen) {
      preparedOpenResources.push(resource);
    }
  });
  return preparedOpenResources;
}

class ResourcesTable extends React.Component {

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
      categoryId: null,
      newResources: [],
    };
    this.filterResources = this.filterResources.bind(this);
    this.getPreviousResources = this.getPreviousResources.bind(this);
    this.getNextResources = this.getNextResources.bind(this);
  }

  componentDidMount() {
    if (this.props.userLocation) {
      this.loadResourcesFromServer(this.props.userLocation);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userLocation) {
      this.loadResourcesFromServer(nextProps.userLocation);
    }
  }

  getPreviousResources() {
    const page = this.state.page - 1;
    this.setState({
      page,
      currentPage: this.state.resources.slice(page * resultsPerPage, (page + 1) * resultsPerPage),
    });
  }

  getNextResources() {
    const page = this.state.page + 1;
    const currentPage = this.state.resources.slice(
      page * resultsPerPage,
      (page * resultsPerPage) + resultsPerPage,
    );
    this.setState({
      page,
      currentPage,
    });
  }

  filterResources() {
    if (this.state.openFilter) {
      this.setState({
        page: 0,
        resources: this.state.allResources,
        currentPage: this.state.allResources.slice(0, resultsPerPage),
        openFilter: false,
      });
    } else {
      this.setState({
        page: 0,
        resources: this.state.openResources,
        currentPage: this.state.openResources.slice(0, resultsPerPage),
        openFilter: true,
      });
    }
  }

  loadResourcesFromServer(userLocation) {
    const { query } = this.props.location;
    const categoryId = query.categoryid;
    this.setState({ categoryId });
    const searchQuery = query.query;

    let path = '/api/resources';
    const params = {
      lat: userLocation.lat,
      long: userLocation.lng,
    };
    if (categoryId) {
      this.setState({
        categoryName: cats[categoryId],
      });
      params.category_id = categoryId;
    } else if (searchQuery) {
      path += '/search';
      params.query = searchQuery;
      this.setState({
        categoryName: `Search: ${searchQuery}`,
      });
    }
    const url = `${path}?${queryString.stringify(params)}`;
    fetch(url, { credentials: 'include' }).then(r => r.json())
      .then((data) => {
        const openResources = prepOpenResources(data.resources);

        this.setState({
          allResources: data.resources,
          resources: data.resources,
          currentPage: data.resources.slice(0, resultsPerPage),
          openResources,
        });
      });
  }

  render() {
    const resultsRangeBegin = (this.state.page * resultsPerPage) + 1;
    const resultsRangeEnd = (this.state.resources && this.state.resources.length) ?
       Math.min(
        this.state.resources.length,
        (this.state.page + 1) * resultsPerPage,
      ) : null;
    const showPreviousButton = this.state.page !== 0;
    const showNextButton = Math.floor(this.state.currentPage.length / resultsPerPage) !== 0 &&
      this.state.allResources.length !== (this.state.page + 1) * resultsPerPage;
    return (!this.state.resources ? <Loader /> :
    <div className="results">
      <div className="results-table">
        <header>
          <h1 className="results-title">{this.state.categoryName}</h1>
          <span className="results-count">{this.state.resources.length} Total Results</span>
        </header>
        <div className="results-filters">
          <ul>
            <li>Filter:</li>
            <li><a className="filters-button" onClick={this.filterResources} role="button" tabIndex="0">{this.state.openFilter ? 'All' : 'Open Now'}</a></li>
          </ul>
        </div>
        <div className="results-table-body">
          <ResourcesList
            resources={this.state.currentPage}
            location={this.props.userLocation}
            page={this.state.page}
            resultsPerPage={resultsPerPage}
            categoryId={this.state.categoryId}
          />
          <div className="add-resource">
            <li className="results-table-entry">
              <Link to={'/resource/new'}>
                <h4 className="entry-headline">
                  <i className="material-icons">add_circle</i> Add a new resource
                </h4>
              </Link>
            </li>
          </div>
          <div className="pagination">
            <div className="pagination-count">
              {this.state.resources && this.state.resources.length ?
                <p>
                  {resultsRangeBegin} — {resultsRangeEnd} of {this.state.resources.length} Results
                </p>
                :
                <p>No results found</p>
              }
            </div>
            {showPreviousButton &&
              <button className="btn btn-link" onClick={this.getPreviousResources}>Previous</button>
            }
            {showNextButton &&
              <button className="btn btn-link" onClick={this.getNextResources}>Next</button>
            }
            <div className="results-algolia-logo-wrapper">
              <a href="https://algolia.com">
                <img
                  className="results-algolia-logo"
                  src={images.algolia}
                  alt="Powered by Algolia"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="results-map">
        <Gmap markers={getMapMarkers(this.state.currentPage, this.props.userLocation)} />
      </div>
    </div>
    );
  }
}

ResourcesTable.defaultProps = {
  userLocation: null,
};

ResourcesTable.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      resourceid: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // userLocation is not required because will be lazy-loaded after initial render.
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default ResourcesTable;
