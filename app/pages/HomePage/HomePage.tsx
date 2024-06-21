import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import { Footer } from "components/ui";
import Hero from "components/ui/Hero/Hero";
import {
  CategorySection,
  FeaturedCategoriesData,
} from "components/ui/Section/CategorySection";
import {
  OppEventCardData,
  OppEventCardSection,
} from "components/ui/Section/OppEventCardSection";
import {
  TwoColumnContent,
  TwoColumnContentSection,
} from "components/ui/TwoColumnContentSection/TwoColumnContentSection";
import React, { useEffect, useState } from "react";
import { client } from "../../sanity";

const builder = imageUrlBuilder(client);

export interface ButtonType {
  slug: string;
  label: string;
}

export interface HeroData {
  name: string;
  title: string;
  description: string;
  backgroundImage: SanityImageSource;
  buttons: ButtonType[];
}

interface HomePageData {
  heroSection: HeroData;
  categoriesSection: FeaturedCategoriesData;
  opportunitySection: OppEventCardData;
  eventSection: OppEventCardData;
  /* TODO: update field in Sanity schema
  to avoid nested values of the same name
  */
  twoColumnContentSections: {
    twoColumnContentSections: TwoColumnContent;
  }[];
}

export const HomePage = () => {
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      const query = `*[_type == "homePage" && name == "Home Page"][0]{
        'heroSection': *[_type == "hero" && name == "Home Hero"][0],
        categoriesSection {...,'featuredCategoriesSection': featuredCategoriesSection[]->},
        opportunitySection {...,'opportunityCards': opportunityCards[]->},
        eventSection {...,'eventCards': eventCards[]->},
        'twoColumnContentSections': *[_type == 'contentPageType' && name == 'Home']{
      twoColumnContentSections[0]->
    }
      }`;

      const result: HomePageData = await client.fetch(query);

      setHomePageData(result);
    };

    fetchHomePageData();
  }, []);

  if (homePageData === null) {
    return <div>Loading...</div>;
  }

  const {
    categoriesSection,
    opportunitySection,
    eventSection,
    heroSection,
    twoColumnContentSections,
  } = homePageData;

  const twoColumnContentData =
    twoColumnContentSections[0].twoColumnContentSections;

  return (
    <>
      <Hero
        backgroundImage={builder.image(heroSection.backgroundImage).url()}
        title={heroSection.title}
        description={heroSection.description}
        buttons={heroSection.buttons}
      />
      <CategorySection sectionData={categoriesSection} />
      <OppEventCardSection
        sectionType="opportunity"
        sectionData={opportunitySection}
      />
      <OppEventCardSection sectionType="event" sectionData={eventSection} />
      <TwoColumnContentSection {...twoColumnContentData} />
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
