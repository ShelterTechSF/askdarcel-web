import React from 'react';
import {
  Pagination,
} from 'react-instantsearch/dom';
import whitelabel from '../../utils/whitelabel';
import SearchRow from './SearchRow';
import './ResultsPagination.scss';

const { appImages: { algolia } } = whitelabel;

const SearchTable = ({ hits, page, hitsPerPage }) => {
  const rows = hits.map((hit, index) => (
    <SearchRow
      hit={hit}
      hitsPerPage={hitsPerPage}
      page={page}
      index={index}
      key={hit.objectID}
    />
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
          showLast={false}
          showFirst={false}
          translations={{
            previous: 'Prev',
            next: 'Next',
          }}
        />
      </div>
      <div className="algolia-img-wrapper">
        <img src={algolia} alt="Search by Algolia" />
      </div>
    </div>
  );
};

export default SearchTable;
