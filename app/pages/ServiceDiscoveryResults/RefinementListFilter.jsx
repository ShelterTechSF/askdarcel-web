import React from 'react';
import PropTypes from 'prop-types';
import { connectRefinementList } from 'react-instantsearch/connectors';
import styles from './ServiceDiscoveryResults.scss';

const RefinementListFilter = ({ items, refine }) => (
  <div className="refinement-wrapper">
    <ul className="refinement-ul">
      {items.map(item => (
        <label key={item.label} className={styles.checkBox}>
          {item.label}
          <input
            type="checkbox"
            checked={item.isRefined}
            onChange={e => {
              e.preventDefault();
              refine(item.value);
            }}
          />
        </label>
      ))}
    </ul>
  </div>
);

RefinementListFilter.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    count: PropTypes.number.isRequired,
    isRefined: PropTypes.bool.isRequired,
  })).isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectRefinementList(RefinementListFilter);
