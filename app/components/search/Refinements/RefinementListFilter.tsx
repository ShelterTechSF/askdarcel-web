import React from "react";
import {
  connectRefinementList,
  RefinementListProvided,
} from "react-instantsearch/connectors";
import styles from "./RefinementFilters.module.scss";

const RefinementListFilter = ({ items, refine }: RefinementListProvided) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          <label className={styles.checkBox}>
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
        </li>
      ))}
    </ul>
  );
};

export default connectRefinementList(RefinementListFilter);
