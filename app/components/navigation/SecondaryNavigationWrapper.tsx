import React, { ReactNode } from "react";

import styles from "./SecondaryNavigationWrapper.module.scss";

// Provides page-level styling for the secondary navigation bar
export const SecondaryNavigationWrapper = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className={styles.container}>
    <div className={styles.innerContainer}>{children}</div>
  </div>
);
