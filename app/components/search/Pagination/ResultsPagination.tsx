import React from 'react';
import { Pagination } from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
import whiteLabel from 'utils/whitelabel';

// This cannot be a Sass module as it styles elements included by Pagination, a 3rd party component
import './ResultsPagination.scss';

const { appImages: { algolia } } = whiteLabel;

const ResultsPagination = () => (
  <div>
    <div className="pagination-container">
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
    <div className="addResource">
      Can&apos;t find the organization you&apos;re looking for?
      <Link to="/organizations/new" className="addResourceButton">
        <i className="material-icons">add_circle</i>
        {' '}
        Add an organization
      </Link>
    </div>
  </div>
);

export default ResultsPagination;
