import React, { useEffect, useState } from "react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import { Footer } from "components/ui";
import imageUrlBuilder from "@sanity/image-url";
import Hero from "components/ui/Hero/Hero";
import { OppEventCardSection } from "components/ui/Section/OppEventCardSection";
import { client } from "../../sanity";
import { HomePageContentColumn } from "./HomePageContentColumn";

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

export const HomePage = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const query = `*[_type == "hero" && name == "Home Hero"][0]{
        name,
        title,
        description,
        backgroundImage,
        buttons
      }`;
      const result: HeroData = await client.fetch(query);
      setHeroData(result);
    };

    fetchHeroData();
  }, []);

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero
        backgroundImage={builder.image(heroData.backgroundImage).url()}
        title={heroData.title}
        description={heroData.description}
        buttons={heroData.buttons}
      />
      {/* Category Card */}
      <OppEventCardSection sectionType="opportunity" />
      <OppEventCardSection sectionType="event" />
      <HomePageContentColumn />
      {/* Newsletter Component */}
      <Footer />
    </>
  );
};

// Remove when new categories is created
// other components are dependent on this list
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
