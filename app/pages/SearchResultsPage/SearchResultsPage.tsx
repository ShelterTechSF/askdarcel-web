import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, SearchBox } from 'react-instantsearch/dom';
import qs from 'qs';

import { useAppContext } from 'utils';
import SearchResultsContainer from '../../components/search/SearchResultsContainer';
import config from '../../config';

const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);

export const SearchResultsPage = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);

  return (
    <div className="search-page-container">
      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={(nextSearchState: any) => {
          const THRESHOLD = 700;
          const newPush = Date.now();
          setLastPush(newPush);
          const newUrl = nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '';
          if (lastPush && newPush - lastPush <= THRESHOLD) {
            history.replace(newUrl);
          } else {
            history.push(newUrl);
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
