import React from "react";
import PropTypes from "prop-types";
import { connectRefinementList } from "react-instantsearch/connectors";
import styles from "./RefinementFilters.module.scss";

const RefinementListFilter = ({ items, refine }) => (
  <ul>
    {items.map((item) => (
      <label key={item.label} className={styles.checkBox}>
        {item.label}
        <input
          className={styles.refinementInput}
          type="checkbox"
          checked={item.isRefined}
          onChange={() => {
            refine(item.value);
          }}
        />
      </label>
    ))}
  </ul>
);

RefinementListFilter.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
      count: PropTypes.number.isRequired,
      isRefined: PropTypes.bool.isRequired,
    })
  ).isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectRefinementList(RefinementListFilter);
