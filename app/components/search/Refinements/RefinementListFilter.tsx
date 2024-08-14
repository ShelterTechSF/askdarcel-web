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
const RefinementListFilter = ({ items, refine }: Props) => {
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
