import React, { ReactNode } from "react";

import styles from "./SecondaryNavigation.module.scss";

// Provides page-level styling for the secondary navigation bar
export const SecondaryNavigationLayout = ({
  children,
}: {
  children: ReactNode;
}) => <div className={`${styles.container}`}>{children}</div>;
