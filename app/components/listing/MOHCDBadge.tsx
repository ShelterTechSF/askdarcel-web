import React from "react";
import { Organization } from "../../models";
import MOHCDFunded from "../../assets/img/ic-mohcd-funded-services.svg";

import styles from "./MOHCDBadge.module.scss";

export const MOHCDBadge = ({ resource }: { resource: Organization }) => {
  const isMOHCDFunded: boolean = resource?.categories.some(
    (category) => category.name === "MOHCD Funded"
  );

  return isMOHCDFunded ? (
    <div className={styles.mohcdBadge}>
      <img
        className={styles.mohcdIcon}
        src={MOHCDFunded}
        alt="Verified by MOHCD"
      />
      <span className={styles.mohcdIconTitle}>Funded by MOHCD</span>
    </div>
  ) : null;
};
