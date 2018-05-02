import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  InstantSearch,
  Configure,
  SearchBox,
  } from 'react-instantsearch/dom';
import { isEqual } from 'lodash';
import qs from 'qs';
import SearchResultsContainer from '../components/Search/SearchResultsContainer';


class Search extends Component {
  constructor(props) {
    super(props);

    this.state = { searchState: { ...qs.parse(props.router.location.query) } };
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
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
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    } else {
      this.props.router.push(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    }
  }
  // eslint-disable-next-line class-methods-use-this
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
    /* eslint-disable no-undef */
    return (
      <div className="search-page-container">
        <InstantSearch
          appId={CONFIG.ALGOLIA_APPLICATION_ID}
          apiKey={CONFIG.ALGOLIA_READ_ONLY_API_KEY}
          indexName={CONFIG.ALGOLIA_INDEX}
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
  /* eslint-enable no-undef */
}

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

export default connect(mapStateToProps)(Search);
