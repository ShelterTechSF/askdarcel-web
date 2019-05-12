import React from 'react';
import {
  Pagination,
} from 'react-instantsearch/dom';
import { images } from 'assets';
import SearchRow from './SearchRow';

const SearchTable = ({ hits, page, hitsPerPage }) => {
  const rows = hits.map((hit, index) => (
    <SearchRow
      hit={hit}
      hitsPerPage={hitsPerPage}
      page={page}
      index={index}
      key={hit.objectID} />
  ));
  return (
    <div>
      <div className="results-table-body">
        <div>
          {rows}
        </div>
      </div>
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
  )
};

export default SearchTable;
