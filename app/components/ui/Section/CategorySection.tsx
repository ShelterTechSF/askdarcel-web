import React from "react";
import { CategoryCard } from "../Cards/CategoryCard";
import styles from "./CategorySection.module.scss";

const categories = [
  {
    label: "Arts, Culture, & Identity",
    icon: "fa-palette",
  },
  {
    label: "Childcare",
    icon: "fa-baby",
  },
  {
    label: "Education",
    icon: "fa-school",
  },
  {
    label: "Family Support",
    icon: "fa-people-roof",
  },
  {
    label: "Health & Wellness",
    icon: "fa-heart-pulse",
  },
  {
    label: "Sports & Recreation",
    icon: "fa-running",
  },
  {
    label: "Youth Workforce & Life Skills",
    icon: "fa-briefcase",
  },
  {
    label: "See all services",
    icon: "fa-arrow-right",
  },
];

/*
TODO: future PR

- Pull in title and description data from sanity once
home page schema is built out
- Update correct search query urls once service page
is built
*/

export const CategorySection = () => {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryCards}>
        {categories.map((category) => {
          return (
            <CategoryCard
              key={category.label}
              label={category.label}
              icon={category.icon}
            />
          );
        })}
      </div>
    </div>
  );
};
