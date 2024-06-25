import React, { ReactNode } from "react";

import styles from "./SecondaryNavigation.module.scss";

// Wrap base page components in Router to add a secondary navigation bar that accepts
// an argument for rendering out a component of navigation items.
export const SecondaryNavigationLayout = ({
  children,
  navigationChildren,
}: {
  children: ReactNode;
  navigationChildren: ReactNode | ReactNode[];
}) => {
  return (
    <>
      <div className={`${styles.container}`}>{navigationChildren}</div>
      {children}
    </>
  );
};
