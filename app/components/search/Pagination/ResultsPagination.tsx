import React from 'react';
import { Pagination } from 'react-instantsearch/dom';
import { Link } from 'react-router-dom';
import whiteLabel from 'utils/whitelabel';

import styles from './ResultsPagination.module.scss';

const { appImages: { algolia } } = whiteLabel;

const ResultsPagination = ({ noResults }: {noResults: boolean}) => (
  <div>
    <div className={`${styles.paginationContainer} ${noResults ? styles.hidePagination : ''}`}>
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
  </div>
);

export default ResultsPagination;
