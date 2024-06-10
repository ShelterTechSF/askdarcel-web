import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import qs from "qs";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";

import { getResourceCount } from "utils/DataService";
import { Footer, NewsArticles } from "components/ui";
import { Partners } from "./components/Partners/Partners";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { HomePageSection } from "./components/Section/Section";
import ResourceList from "./components/ResourceList/ResourceList";
import { whiteLabel } from "../../utils";
import Hero from "components/ui/Hero/Hero";
import bgImage from "../../assets/img/HomePage/tempHero.png";
// import imageUrlBuilder from "@sanity/image-url";
import { client } from "../../sanity";

// Not currently working
// const builder = imageUrlBuilder(client);

export interface Button {
  href: string;
  label: string;
}

export interface HeroData {
  name: string;
  title: string;
  description: string;
  backgroundImage: SanityImageSource;
  buttons: Button[];
}

const { showBreakingNews } = whiteLabel;

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

export const HomePage = () => {
  const [resourceCount, setResourceCount] = useState<number | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const submitSearch = () => {
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  };

  useEffect(() => {
    getResourceCount().then((count: number) => setResourceCount(count));
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
      {showBreakingNews && <NewsArticles />}
      <Hero
        backgroundImage={bgImage}
        // backgroundImage={builder.image(heroData.backgroundImage).url()}
        title={heroData.title}
        description={heroData.description}
        buttons={heroData.buttons}
      />
      <HomePageSection title="Find essential services in San Francisco">
        <ResourceList resources={coreCategories} />
      </HomePageSection>

      <HomePageSection
        title="Browse Directory"
        description="Search the directory for a specific social service provider or browse by category."
      >
        <SearchBar
          placeholder={`Search ${
            resourceCount || ""
          } resources in San Francisco`}
          onSubmit={submitSearch}
          onChange={(newSearchValue: string) => setSearchValue(newSearchValue)}
          value={searchValue}
        />
      </HomePageSection>
      <Partners />
      <Footer />
    </>
  );
};
