import React from "react";
import { CategoryCard } from "../Cards/CategoryCard";
import styles from "./CategorySection.module.scss";
import { HomePageSection } from "pages/HomePage/components/Section";

interface Category {
  icon: {
    name: string;
    provider: string;
  };
  label: string;
  slug: string;
  name: string;
}

interface FeaturedCategoriesSection {
  category: Category[];
  name: string;
}

export interface FeaturedCategoriesData {
  header: string;
  subheader: string;
  backgroundColor: string;
  featuredCategoriesSection: FeaturedCategoriesSection[];
}

interface CategorySectionProps {
  sectionData: FeaturedCategoriesData;
}

export const CategorySection = (props: CategorySectionProps) => {
  const { sectionData } = props;

  if (!sectionData) {
    return <div>Loading...</div>;
  }

  const { header, subheader, backgroundColor, featuredCategoriesSection } =
    sectionData;
  const categories = featuredCategoriesSection[0].category;
  const navigationIcon = {
    name: "fa-arrow-right",
    provider: "fas",
  };

  return (
    <HomePageSection
      title={header}
      description={subheader}
      backgroundColor={backgroundColor}
    >
      <div className={styles.categorySection}>
        <div className={styles.categoryCards}>
          {categories.map((category) => {
            console.log(category);
            return (
              <CategoryCard
                key={category.label}
                label={category.label}
                slug={category.slug}
                icon={category.icon}
              />
            );
          })}
          <CategoryCard
            key="See all services"
            label="See all services"
            slug={"/"}
            icon={navigationIcon}
          />
        </div>
      </div>
    </HomePageSection>
  );
};
