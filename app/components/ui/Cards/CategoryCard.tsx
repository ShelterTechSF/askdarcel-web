import React from "react";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  label: string;
  href: string;
  icon: {
    name: string;
    provider: string;
  };
}

export const CategoryCard = (props: CategoryCardProps) => {
  const { label, icon, href } = props;
  const iconName = `${icon.provider} ${icon.name}`;

  return (
    <a href={href} className={styles.categoryCard}>
      <span className={`${iconName} ${styles.icon}`} />
      <label className={styles.categoryTitle}>{label}</label>
    </a>
  );
};
