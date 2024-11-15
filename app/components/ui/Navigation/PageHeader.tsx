import React, { ReactNode } from "react";
import classNames from "classnames";
import styles from "./PageHeader.module.scss";

// Provides page-level styling for the secondary navigation bar
export const PageHeader = ({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
}) => (
  <div className={classNames(styles.container, styles[variant])}>
    <div className={styles.innerContainer}>{children}</div>
  </div>
);
