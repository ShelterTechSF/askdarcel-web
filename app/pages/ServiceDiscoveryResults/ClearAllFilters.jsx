import React from 'react';
import PropTypes from 'prop-types';
import { connectCurrentRefinements } from 'react-instantsearch/connectors';
import styles from './ServiceDiscoveryResults.scss';

const ClearAllFilter = ({ items, refine }) => (
  <div
    role="button"
    tabIndex="0"
    className={styles.clearAll}
    onClick={() => refine(items)}
    disabled={!items.length}
  >
        Clear all resources
  </div>
);

ClearAllFilter.propTypes = {
  items: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectCurrentRefinements(ClearAllFilter);
