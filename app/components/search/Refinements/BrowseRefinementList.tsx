import React, { useEffect, useState } from "react";
import { useRefinementList, UseRefinementListProps } from "react-instantsearch";
import styles from "./RefinementFilters.module.scss";

interface Props extends UseRefinementListProps {
  transform?: UseRefinementListProps["transformItems"];
  attribute: string;
}

// Arbitrary upper limit to ensure all refinements are displayed
const MAXIMUM_ITEMS = 9999;

/**
 * Facet refinement list component for browse interfaces
 */
const BrowseRefinementList = ({ attribute, transform }: Props) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const { items, refine } = useRefinementList({
    attribute,
    sortBy: ["name:asc"],
    transformItems: transform,
    limit: MAXIMUM_ITEMS,
  });

  useEffect(() => {
    items.forEach((item) => {
      if (item.isRefined) {
        checked.add(item.value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const changeRefinement = (value: string) => {
    refine(value);

    if (checked.has(value)) {
      checked.delete(value);
    } else {
      checked.add(value);
    }

    setChecked(checked);
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.label} data-testid={"browserefinementlist-item"}>
          <label className={styles.checkBox}>
            {item.label}
            <input
              className={styles.refinementInput}
              type="checkbox"
              checked={checked.has(item.value)}
              onChange={() => changeRefinement(item.value)}
            />
          </label>
        </li>
      ))}
    </ul>
  );
};

export default BrowseRefinementList;
