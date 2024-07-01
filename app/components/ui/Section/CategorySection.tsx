import { HomePageSection } from "pages/HomePage/components/Section";
import React from "react";
import { BackgroundColorVariant } from "models";
import { CategoryCard } from "../Cards/CategoryCard";
import styles from "./CategorySection.module.scss";
// import { Loader } from "../Loader";

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
  backgroundColor: BackgroundColorVariant;
  featuredCategoriesSection: FeaturedCategoriesSection[];
}

export const CategorySection = () => {
  // const { sectionData } = props;

  // if (!sectionData) {
  //   return <div>Loading...</div>;
  // }

  // const { header, subheader, backgroundColor, featuredCategoriesSection } =
  //   sectionData;
  // const featuredCategories = featuredCategoriesSection[0].category;

  return (
    <HomePageSection
      title={tempCategoriesSection.header}
      description={tempCategoriesSection.subheader}
      backgroundColor="secondary"
    >
      <div className={styles.categorySection}>
        <div className={styles.categoryCards}>
          {topLevelCategories.map((category) => {
            return (
              <CategoryCard
                key={category.name}
                label={category.name}
                href={`/${category.categorySlug}/results`}
                icon={category.icon}
              />
            );
          })}
          <CategoryCard
            key="See all services"
            label="See all services"
            href="/search"
            icon={{ provider: "fas", name: "fa-arrow-right" }}
          />
        </div>
      </div>
    </HomePageSection>
  );
};

// Hardcoded until CMS is running again
export const topLevelCategories = [
  {
    name: "Food",
    icon: {
      name: "fa-utensils",
      provider: "fa",
    },
    categorySlug: "food-resources",
  },
  {
    name: "Health and COVID-19",
    icon: {
      name: "fa-hospital",
      provider: "fa",
    },
    categorySlug: "medical-services-resources",
  },
  {
    name: "Showers, Hygiene and other Services",
    icon: {
      name: "fa-shower",
      provider: "fa",
    },
    categorySlug: "hygiene-resources",
  },
  {
    name: "Shelters",
    icon: {
      name: "fa-bed",
      provider: "fa",
    },
    categorySlug: "shelter-resources",
  },
  {
    name: "Long-term Housing",
    icon: {
      name: "fa-house",
      provider: "fa",
    },
    categorySlug: "longterm-housing-resources",
  },
  {
    name: "Rental Assistance and Eviction Prevention",
    icon: {
      name: "fa-house-chimney-user",
      provider: "fa",
    },
    categorySlug: "rental-assistance-resources",
  },
  {
    name: "Financial Assistance",
    icon: {
      name: "fa-wallet",
      provider: "fa",
    },
    categorySlug: "financial-resources",
  },
  {
    name: "Jobs",
    icon: {
      name: "fa-briefcase",
      provider: "fa",
    },
    categorySlug: "job-assistance-resources",
  },
  {
    name: "Internet, Devices & Technology Training",
    icon: {
      name: "fa-wifi",
      provider: "fa",
    },
    categorySlug: "internet-access-resources",
  },
  {
    name: "LGBTQ+ Resources",
    icon: {
      name: "fa-people-group",
      provider: "fa",
    },
    categorySlug: "lgbtq-resources",
  },
  {
    name: "Resources for Domestic Violence Survivors",
    icon: {
      name: "fa-warning",
      provider: "fa",
    },
    categorySlug: "domestic-violence-resources",
  },
  // Removing last one to keep with style guidelines for now
  // {
  //   name: "Substance Use Resources",
  //   icon: {
  //     name: "fa-suitcase-medical",
  //     provider: "fa",
  //   },
  //   categorySlug: "substance-use-resources",
  // },
];

const tempCategoriesSection = {
  header: "Browse services",
  subheader: "Description text explaining this section goes here.",
};
