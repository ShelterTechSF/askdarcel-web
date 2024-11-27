import { Button } from "components/ui/inline/Button/Button";
import React from "react";
import { BackgroundColorVariant } from "models";
import styles from "./Section.module.scss";
import { Link } from "models/Strapi";

export interface Slug {
  current: string;
  _type: string;
}

export const HomePageSection = ({
  title,
  description,
  backgroundColor,
  link,
  children,
}: {
  title?: string;
  description?: string;
  backgroundColor: BackgroundColorVariant;
  children?: React.ReactNode;
  link?: Link;
}) => (
  <section
    className={`${styles.section} ${styles[backgroundColor]}`}
    data-testid={"homepage-section"}
  >
    <div className={styles.content}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {link && (
          <Button href={link.url} arrowVariant="after" size="lg">
            {link.text}
          </Button>
        )}
      </div>
      {children}
    </div>
  </section>
);
