import React from 'react';
import { connectHits } from 'react-instantsearch/connectors';
import SearchRow from './SearchRow';


const CustomSearchHits = connectHits(({ hits }) => (
  <div>
    {
      hits.map((hit, index) => (
        <SearchRow hit={hit} index={index} key={hit.objectID} />
      ))
    }
  </div>
));

export default CustomSearchHits;
