import React from "react";
import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { useHomepageData } from "hooks/StrapiAPI";
import { Homepage, StrapiDatum } from "models/Strapi";

export const HomePage = () => {
  const { data, isLoading } = useHomepageData();

  const res = data as StrapiDatum<Homepage>;

  const homePageData = res?.attributes;

  if (isLoading) {
    return null;
  }

  const { hero } = homePageData || {};

  return (
    <>
      <h1 className="sr-only">Homepage</h1>
      {hero && (
        <Hero
          backgroundImage={hero.background_image.data?.attributes.url ?? ""}
          title={hero.title}
          description={hero.description}
          buttons={hero.buttons}
        />
      )}
      <CategorySection />
    </>
  );
};
