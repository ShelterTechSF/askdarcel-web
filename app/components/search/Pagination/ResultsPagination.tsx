import React from 'react';
import { Pagination } from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
import whiteLabel from 'utils/whitelabel';

import styles from './ResultsPagination.module.scss';

const { appImages: { algolia } } = whiteLabel;

const ResultsPagination = () => (
  <div>
    <div className={styles.paginationContainer}>
      <div className={styles.resultsPagination}>
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
      <div className={styles.algoliaImgWrapper}>
        <img src={algolia} alt="Search by Algolia" />
      </div>
    </div>
    <div className={styles.addResource}>
      Can&apos;t find the organization you&apos;re looking for?
      <Link to="/organizations/new" className={styles.addResourceButton}>
        <i className="material-icons">add_circle</i>
        {' '}
        Add an organization
      </Link>
    </div>
  </div>
);

export default ResultsPagination;
