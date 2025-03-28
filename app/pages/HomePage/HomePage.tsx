import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import qs from "qs";

import { getResourceCount } from "utils/DataService";
import { Footer, NewsArticles } from "components/ui";
import { Partners } from "components/Partners/Partners";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { HomePageSection } from "./components/Section/Section";
import ResourceList from "./components/ResourceList/ResourceList";
import { whiteLabel } from "../../utils";

const { showBreakingNews } = whiteLabel;

export const coreCategories = [
  {
    algoliaCategoryName: "sfsg-food",
    name: "Food",
    icon: "food",
    categorySlug: "food-resources",
  },
  {
    algoliaCategoryName: "sfsg-health",
    name: "Health and COVID-19",
    icon: "hospital",
    categorySlug: "medical-services-resources",
  },
  {
    algoliaCategoryName: "sfsg-hygiene",
    name: "Showers, Hygiene and other Services",
    icon: "shower",
    categorySlug: "hygiene-resources",
  },
  {
    algoliaCategoryName: "sfsg-shelter",
    name: "Shelters",
    icon: "bed",
    categorySlug: "shelter-resources",
  },
  {
    algoliaCategoryName: "sfsg-longtermhousing",
    name: "Long-term Housing",
    icon: "longterm-housing",
    categorySlug: "longterm-housing-resources",
  },
  {
    algoliaCategoryName: "sfsg-housing",
    name: "Rental Assistance and Eviction Prevention",
    icon: "housing-heart",
    categorySlug: "rental-assistance-resources",
  },
  {
    algoliaCategoryName: "sfsg-finance",
    name: "Financial Assistance",
    icon: "wallet",
    categorySlug: "financial-resources",
  },
  {
    algoliaCategoryName: "sfsg-jobs",
    name: "Jobs",
    icon: "employment",
    categorySlug: "job-assistance-resources",
  },
  {
    algoliaCategoryName: "sfsg-internet",
    name: "Internet, Devices & Technology Training",
    icon: "devices",
    categorySlug: "internet-access-resources",
  },
  {
    algoliaCategoryName: "sfsg-lgbtqa",
    name: "LGBTQ+ Resources",
    icon: "community",
    categorySlug: "lgbtq-resources",
  },
  {
    algoliaCategoryName: "sfsg-domesticviolence",
    name: "Resources for Domestic Violence Survivors",
    icon: "warning",
    categorySlug: "domestic-violence-resources",
  },
  {
    algoliaCategoryName: "sfsg-substanceuse",
    name: "Substance Use Resources",
    icon: "substance-use",
    categorySlug: "substance-use-resources",
  },
];

export const HomePage = () => {
  const [resourceCount, setResourceCount] = useState<number | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();

  const submitSearch = () => {
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  };

  useEffect(() => {
    getResourceCount().then((count: number) => setResourceCount(count));
  }, []);

  return (
    <>
      {showBreakingNews && <NewsArticles />}
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
      <div style={{ marginTop: "70px" }} />
      <Partners />
      <Footer />
    </>
  );
};
