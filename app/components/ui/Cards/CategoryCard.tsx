import React from "react";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  label: string;
  slug: string;
  icon: {
    name: string;
    provider: string;
  };
}

export const CategoryCard = (props: CategoryCardProps) => {
  const { label, icon } = props;
  const searchQuery =
    label === "See all services" ? "" : encodeURIComponent(label);

  const iconName = `${icon.provider} ${icon.name}`;
  return (
    <a href={`/service-finder${searchQuery}`} className={styles.categoryCard}>
      <span className={`${iconName} ${styles.icon}`} />
      <p className={styles.categoryTitle}>{label}</p>
    </a>
  );
};
