import React from 'react';
import PropTypes from 'prop-types';
import { connectCurrentRefinements } from 'react-instantsearch/connectors';
import styles from './RefinementFilters.module.scss';

const ClearAllFilter = ({ items, refine, setSearchRadius }) => (
  <div
    role="button"
    tabIndex="0"
    className={styles.clearAll}
    onClick={() => {
      refine(items);
      setSearchRadius('all');
    }}
    disabled={!items.length}
  >
    Clear all
  </div>
);

ClearAllFilter.propTypes = {
  items: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectCurrentRefinements(ClearAllFilter);
