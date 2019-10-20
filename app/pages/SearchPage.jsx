import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  InstantSearch,
  Configure,
  SearchBox,
} from 'react-instantsearch/dom';
import { isEqual } from 'lodash';
import qs from 'qs';

import SearchResultsContainer from '../components/search/SearchResultsContainer';
import config from '../config';


class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchState: qs.parse(props.location.search.slice(1)),
    };
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  componentWillReceiveProps() {
    const { location: { search } } = this.props;
    this.setState({ searchState: qs.parse(search.slice(1)) });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { searchState } = this.state;
    return !isEqual(searchState, nextState.searchState);
  }

  onSearchStateChange(nextSearchState) {
    const THRESHOLD = 700;
    const newPush = Date.now();
    const { history } = this.props;
    const { lastPush } = this.state;
    this.setState({ lastPush: newPush, searchState: nextSearchState });
    if (lastPush && newPush - lastPush <= THRESHOLD) {
      history.replace(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    } else {
      history.push(
        nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '',
      );
    }
  }

  render() {
    const { userLocation } = this.props;
    const { aroundLatLng, searchState } = this.state;
    const configuration = aroundLatLng ? (
      <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} />
    ) : (
      <Configure aroundLatLngViaIP aroundRadius="all" />
    );
    return (
      <div className="search-page-container">

        <InstantSearch
          appId={config.ALGOLIA_APPLICATION_ID}
          apiKey={config.ALGOLIA_READ_ONLY_API_KEY}
          indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
          searchState={searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={state => `search?${qs.stringify(state)}`}
        >
          {configuration}
          <div className="search-box">
            <SearchBox />
          </div>
          <SearchResultsContainer />
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

export const SearchResultsPage = withRouter(connect(mapStateToProps)(SearchPage));
