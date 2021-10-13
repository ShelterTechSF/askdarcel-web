import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, SearchBox } from 'react-instantsearch/dom';
import qs from 'qs';

import { useAppContext } from 'utils';
import SearchResultsContainer from '../components/search/SearchResultsContainer';
import config from '../config';

const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);

export const SearchResultsPage = () => {
  const history = useHistory();
  const { userLocation } = useAppContext();
  const [searchState, setSearchState] = useState({});
  const [lastPush, setLastPush] = useState(Date.now());

  return (
    <div className="search-page-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={(nextSearchState: any) => {
          const THRESHOLD = 700;
          const newPush = Date.now();
          setSearchState(nextSearchState);
          setLastPush(newPush);
          const newParams = new URLSearchParams(nextSearchState);

          if (lastPush && newPush - lastPush <= THRESHOLD) {
            history.replace(nextSearchState ? `search?${newParams.toString()}` : '');
          } else {
            history.push(nextSearchState ? `search?${newParams.toString()}` : '');
          }
        }}
        createURL={(state: any) => `search?${qs.stringify(state)}`}
      >
        {userLocation ? (
          <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} />
        ) : (
          <Configure aroundLatLngViaIP aroundRadius="all" />
        )}
        <div className="search-box">
          <SearchBox />
        </div>
        <SearchResultsContainer />
      </InstantSearch>
    </div>
  );
};
