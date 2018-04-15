import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { 
  InstantSearch, 
  Configure,
  Index,
  SearchBox,
  Hits,
  Pagination,
  RefinementList,
  } from 'react-instantsearch/dom';
import SearchMap from '../components/Search/SearchMap';
import MapTest from '../components/Search/MapTest';
import { connectStateResults } from 'react-instantsearch/connectors';
import ServiceEntry from '../components/Search/ServiceEntry';
import ResourceEntry from '../components/Search/ResourceEntry';
import SearchTable from '../components/Search/SearchTable';
import SearchResultsContainer from '../components/Search/SearchResultsContainer';
import qs from 'qs';
import { isEqual } from 'lodash';


class Search extends Component {
  constructor(props) {
    super(props);

    this.state = { searchState: { ...qs.parse(props.router.location.query) } };
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
    this.createURL = this.createURL.bind(this);
  }
  componentWillReceiveProps() {
    this.setState({ searchState: qs.parse(this.props.router.location.query) });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state.searchState, nextState.searchState);
  }

  onSearchStateChange(nextSearchState) {
    const THRESHOLD = 700;
    const newPush = Date.now();
    this.setState({ lastPush: newPush, searchState: nextSearchState });
    if (this.state.lastPush && newPush - this.state.lastPush <= THRESHOLD) {
      this.props.router.replace(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : ''
      );
    } else {
      this.props.router.push(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : ''
      );
    }
  }

  createURL(state) {
    return `search?${qs.stringify(state)}`;
  }

  render() {
    const { userLocation } = this.props;
    const configuration = this.state.aroundLatLng ? (
      <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} />
    ) : (
      <Configure aroundLatLngViaIP aroundRadius="all" />
    );

    return (
      <div className="search-page-container">
        <InstantSearch
          appId="J8TVT53HPZ"
          apiKey="fdf77b152ff7ce0ea4e4221ff3d17d85"
          indexName="development_service_Resource"
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={this.createURL}
        >
          {configuration}
          <div className="search-box">
            <SearchBox />
          </div>
          <div>
            <SearchResultsContainer />
          </div>
        </InstantSearch>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps) (Search);
