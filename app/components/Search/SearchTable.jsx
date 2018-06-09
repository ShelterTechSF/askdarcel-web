import React from 'react';
import {
  Hits,
  Pagination,
  } from 'react-instantsearch/dom';
import { images } from 'assets';

import SearchRow from './SearchRow';

const SearchTable = () => (
  <div className="results-table-body">
    <Hits hitComponent={SearchRow} />
    <div className="results-pagination">
      <Pagination
        padding={2}
        showLast
      />
    </div>
    <div className="algolia-img-wrapper">
      <img src={images.algolia} alt="Search by Algolia" />
    </div>
  </div>
);

export default SearchTable;
