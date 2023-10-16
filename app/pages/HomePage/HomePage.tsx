import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import qs from "qs";

import auth0 from "auth0-js";
import { getResourceCount } from "utils/DataService";
import { Footer, NewsArticles } from "components/ui";
import { Partners } from "./components/Partners/Partners";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { HomePageSection } from "./components/Section/Section";
import ResourceList from "./components/ResourceList/ResourceList";
import { whiteLabel } from "../../utils";

const { showBreakingNews } = whiteLabel;

const covidResources = [
  { name: "Food", icon: "food", categorySlug: "food-resources" },
  {
    name: "Health and COVID-19",
    icon: "hospital",
    categorySlug: "medical-services-resources",
  },
  {
    name: "Showers, Hygiene and other Services",
    icon: "shower",
    categorySlug: "hygiene-resources",
  },
  { name: "Shelters", icon: "bed", categorySlug: "shelter-resources" },
  {
    name: "Long-term Housing",
    icon: "longterm-housing",
    categorySlug: "longterm-housing-resources",
  },
  {
    name: "Rental Assistance and Eviction Prevention",
    icon: "housing-1",
    categorySlug: "rental-assistance-resources",
  },
  {
    name: "Financial Assistance",
    icon: "wallet",
    categorySlug: "financial-resources",
  },
  {
    name: "Jobs",
    icon: "employment",
    categorySlug: "job-assistance-resources",
  },
  {
    name: "Internet, Devices & Technology Training",
    icon: "devices",
    categorySlug: "internet-access-resources",
  },
  {
    name: "LGBTQ+ Resources",
    icon: "community",
    categorySlug: "lgbtq-resources",
  },
  {
    name: "Resources for Domestic Violence Survivors",
    icon: "warning",
    categorySlug: "domestic-violence-resources",
  },
  {
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



    webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
      if (err) {
        console.log(err);
      }
      console.log(authResult)
      if (authResult?.accessToken) {
        window.foobar = authResult.accessToken;
        webAuth.client.userInfo(authResult.accessToken, (tokenErr, user) => {
          if (tokenErr) {
            console.log(tokenErr);
          }
          console.log(user);
          // alert(`Welcome, ${user.email}!`);
        });
      }
    });
  }, []);

  const secureApiCall = () => {
    console.log('hi: ', window.foobar)
    fetch("/api/resources/548", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${window.foobar}`,
      },
    }).then(resp => {
      console.log(resp)
    });
  };

  return (
    <>
      {showBreakingNews && <NewsArticles />}
      <HomePageSection title="Find essential services in San Francisco">
        <ResourceList resources={covidResources} />
        <button onClick={secureApiCall}>Hi Buddy!</button>
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
