import React from "react";
import { LabelTag } from "components/ui/LabelTag";
import { Service } from "../../models";
import styles from "./LabelTagRows.module.scss";

const LabelTagRows = ({
  categories,
  eligibilities,
}: {
  categories?: Service["categories"];
  eligibilities?: Service["eligibilities"];
}) => {
  const topLevelCategories = categories?.filter(
    (srv) => srv.top_level === true
  );
  const subcategories = categories?.filter((srv) => srv.top_level === false);

  return (
    <>
      {topLevelCategories && topLevelCategories.length > 0 && (
        <tr>
          <th>Categories</th>
          <td data-testid={"top-level-categories"} className={styles.labelTags}>
            {topLevelCategories.map((category) => (
              <LabelTag key={category.id} label={category.name} />
            ))}
          </td>
        </tr>
      )}

      {subcategories && subcategories.length > 0 && (
        <tr>
          <th>Subcategories</th>
          <td data-testid={"subcategories"} className={styles.labelTags}>
            {subcategories.map((category) => (
              <LabelTag key={category.id} label={category.name} />
            ))}
          </td>
        </tr>
      )}

      {eligibilities && eligibilities.length > 0 && (
        <tr>
          <th>Eligibilities</th>
          <td data-testid={"eligibilities"} className={styles.labelTags}>
            {eligibilities.map((eligibility) => (
              <LabelTag key={eligibility.id} label={eligibility.name} />
            ))}
          </td>
        </tr>
      )}
    </>
  );
};

export default LabelTagRows;
