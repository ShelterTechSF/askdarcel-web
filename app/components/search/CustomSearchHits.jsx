import React from 'react';
import { images } from 'assets';
import { connectHits } from 'react-instantsearch/connectors';
import SearchRow from './SearchRow';


const CustomSearchHits = connectHits(({hits}) => (
  <div>
    {
      hits.map((hit, index) => {
        return (
          <SearchRow hit={hit} index={index} key={hit.objectID} />
        );
      })
    }
  </div>
));

export default CustomSearchHits;
