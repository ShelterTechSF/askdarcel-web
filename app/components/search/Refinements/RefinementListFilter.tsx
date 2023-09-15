import React from "react";
import { connectRefinementList } from "react-instantsearch/connectors";
import styles from "./RefinementFilters.module.scss";

type Item = {
  label: string;
  value: string[];
  count: number;
  isRefined: boolean;
};

type Props = {
  items: Item[];
  refine: (value: string[]) => void;
};
const RefinementListFilter = ({ items, refine }: Props) => (
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

export default connectRefinementList(RefinementListFilter);
