import React, { ReactNode } from "react";

import styles from "./Layout.module.scss";

export const Layout = ({
  children,
  customClass = "",
}: {
  children: ReactNode;
  customClass?: string;
}) => <div className={`${styles.grid} ${customClass}`}>{children}</div>;
