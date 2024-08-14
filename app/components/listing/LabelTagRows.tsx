import React from "react";
import { LabelTag } from "components/ui/LabelTag";
import { Service } from "../../models";
import styles from "./LabelTagRows.module.scss";

const LabelTagRows = ({ service }: { service: Service }) => {
  const topLevelCategories = service.categories?.filter(
    (srv) => srv.top_level === true
  );
  const subcategories = service.categories?.filter(
    (srv) => srv.top_level === false
  );

  return (
    <>
      {topLevelCategories.length > 0 && (
        <tr>
          <th>Categories</th>
          <td className={styles.labelTags}>
            {topLevelCategories.map((srv) => (
              <LabelTag label={srv.name} />
            ))}
          </td>
        </tr>
      )}

      {subcategories.length > 0 && (
        <tr>
          <th>Subcategories</th>
          <td className={styles.labelTags}>
            {subcategories.map((srv) => (
              <LabelTag label={srv.name} />
            ))}
          </td>
        </tr>
      )}

      {service.eligibilities.length > 0 && (
        <tr>
          <th>Eligibilities</th>
          <td className={styles.labelTags}>
            {service.eligibilities.map((srv) => (
              <LabelTag label={srv.name} />
            ))}
          </td>
        </tr>
      )}
    </>
  );
};

export default LabelTagRows;
