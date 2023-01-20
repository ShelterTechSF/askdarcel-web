import React from "react";

import styles from "./Section.module.scss";

export const HomePageSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) => (
  <section className={styles.section}>
    <div className={styles.content}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.description}>{description}</div>
      {children}
    </div>
  </section>
);
