import React from "react";

import styles from "./Section.module.scss";

export const Section = ({
  title,
  subtitle,
  body,
  addClass,
}: {
  title?: React.ReactNode;
  subtitle?: string;
  body?: string;
  addClass?: string;
}) => (
  <section className={`${addClass || ""}`}>
    {title && <h1 className={styles.title}>{title}</h1>}
    {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
    {body && <p className={styles.body}>{body}</p>}
  </section>
);
