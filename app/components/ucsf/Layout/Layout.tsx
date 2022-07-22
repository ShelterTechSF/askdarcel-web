import React, { ReactNode } from 'react';

import styles from './Layout.module.scss';

export function Layout({ children }: {
  children: ReactNode;
}) {
  return (
    <div className={styles.grid}>
      {children}
    </div>
  );
}
