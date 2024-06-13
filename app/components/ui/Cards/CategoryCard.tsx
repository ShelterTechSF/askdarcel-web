import React from "react";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  label: string;
  icon: string;
}
export const CategoryCard = (props: CategoryCardProps) => {
  const { label, icon } = props;
  const searchQuery =
    label === "See all services" ? "" : encodeURIComponent(label);

  return (
    <div className={styles.categoryCard}>
      <span className={`fas ${icon}`} />
      <p className={styles.categoryTitle}>
        <a href={`/service-finder${searchQuery}`}>{label}</a>
      </p>
    </div>
  );
};
