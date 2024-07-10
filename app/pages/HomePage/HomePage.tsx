import { Footer } from "components/ui";
import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { OppEventCardSection } from "components/ui/Section/OppEventCardSection";
import { TwoColumnContentSection } from "components/ui/TwoColumnContentSection/TwoColumnContentSection";
import React from "react";
import { StrapiModel } from "models/Strapi";
import { useHomepageData } from "../../hooks/StrapiAPI";

export const HomePage = () => {
  const { data, isLoading } = useHomepageData();

  const res = data as StrapiModel.StrapiDatum<StrapiModel.Homepage>;

  const homePageData = res?.attributes;

  if (isLoading) {
    return null;
  }

  const {
    opportunity_section,
    opportunities,
    event_section,
    events,
    hero,
    two_column_content_blocks,
  } = homePageData;

  const twoColumnContentData = two_column_content_blocks.data;

  return (
    <>
      {hero && (
        <Hero
          backgroundImage={hero.background_image.data?.attributes.url ?? ""}
          title={hero.title}
          description={hero.description}
          buttons={hero.buttons}
        />
      )}
      <CategorySection />
      <OppEventCardSection
        sectionType="opportunity"
        sectionData={opportunity_section}
        opportunities={opportunities.data ?? []}
      />
      <OppEventCardSection
        sectionType="event"
        sectionData={event_section}
        events={events.data ?? []}
      />
      {twoColumnContentData?.map((content) => (
        <TwoColumnContentSection key={content.id} {...content.attributes} />
      ))}

      {/* Newsletter Component */}
      <Footer />
    </>
  );
};

/* TODO: Remove when new categories are created
 other components are dependent on this list */

export const coreCategories = [
  {
    algoliaCategoryName: "Covid-food",
    name: "Food",
    icon: "food",
    categorySlug: "food-resources",
  },
  {
    algoliaCategoryName: "Covid-health",
    name: "Health and COVID-19",
    icon: "hospital",
    categorySlug: "medical-services-resources",
  },
  {
    algoliaCategoryName: "Covid-hygiene",
    name: "Showers, Hygiene and other Services",
    icon: "shower",
    categorySlug: "hygiene-resources",
  },
  {
    algoliaCategoryName: "Covid-shelter",
    name: "Shelters",
    icon: "bed",
    categorySlug: "shelter-resources",
  },
  {
    algoliaCategoryName: "Covid-longtermhousing",
    name: "Long-term Housing",
    icon: "longterm-housing",
    categorySlug: "longterm-housing-resources",
  },
  {
    algoliaCategoryName: "Covid-housing",
    name: "Rental Assistance and Eviction Prevention",
    icon: "housing-heart",
    categorySlug: "rental-assistance-resources",
  },
  {
    algoliaCategoryName: "Covid-finance",
    name: "Financial Assistance",
    icon: "wallet",
    categorySlug: "financial-resources",
  },
  {
    algoliaCategoryName: "Covid-jobs",
    name: "Jobs",
    icon: "employment",
    categorySlug: "job-assistance-resources",
  },
  {
    algoliaCategoryName: "Covid-internet",
    name: "Internet, Devices & Technology Training",
    icon: "devices",
    categorySlug: "internet-access-resources",
  },
  {
    algoliaCategoryName: "Covid-lgbtqa",
    name: "LGBTQ+ Resources",
    icon: "community",
    categorySlug: "lgbtq-resources",
  },
  {
    algoliaCategoryName: "Covid-domesticviolence",
    name: "Resources for Domestic Violence Survivors",
    icon: "warning",
    categorySlug: "domestic-violence-resources",
  },
  {
    algoliaCategoryName: "Covid-substanceuse",
    name: "Substance Use Resources",
    icon: "substance-use",
    categorySlug: "substance-use-resources",
  },
];
