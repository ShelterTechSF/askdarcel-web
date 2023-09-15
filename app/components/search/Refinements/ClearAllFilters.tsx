import React from "react";
import { connectCurrentRefinements } from "react-instantsearch/connectors";
import type { Refinement, RefinementValue } from "react-instantsearch-core";
import styles from "./RefinementFilters.module.scss";

type Props = {
  items: Refinement[];
  refine: (value: Refinement[] | RefinementValue | RefinementValue[]) => void;
  setSearchRadius: (radius: string) => void;
};

const ClearAllFilter = ({ items, refine, setSearchRadius }: Props) => (
  <div
    role="button"
    tabIndex={0}
    className={styles.clearAll}
    onClick={() => {
      refine(items);
      setSearchRadius("all");
    }}
  >
    Clear all
  </div>
);

export default connectCurrentRefinements<Props>(ClearAllFilter);
