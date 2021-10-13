import React, { Component } from 'react';
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

  shouldComponentUpdate(nextProps, nextState) {
    const { searchState } = this.state;
    return !isEqual(searchState, nextState.searchState);
  }

  componentDidUpdate(prevProps) {
    // Keep searchState synced with actual URL query parameters
    const { location } = this.props;
    const { location: prevLocation } = prevProps;
    if (location !== prevLocation) {
      // This lint rule is disabled because the React documentation says it is
      // safe to call setState() in componentDidUpdate as long as it's wrapped
      // in a conditional.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ searchState: qs.parse(location.search.slice(1)) });
    }
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
