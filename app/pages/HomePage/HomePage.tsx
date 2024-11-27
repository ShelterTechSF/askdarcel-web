import React from "react";
import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { useHomepageData } from "hooks/StrapiAPI";
import { Homepage, StrapiDatum } from "models/Strapi";
import { TwoColumnContentSection } from "components/ui/TwoColumnContentSection/TwoColumnContentSection";

export const HomePage = () => {
  const { data, isLoading } = useHomepageData();

  const res = data as StrapiDatum<Homepage>;

  const homePageData = res?.attributes;

  if (isLoading) {
    return null;
  }

  const { hero, two_column_content_blocks } = homePageData || {};
  const twoColumnContentData = two_column_content_blocks.data;

  return (
    <>
      <h1 className="sr-only" data-testid={"homepage-title"}>
        Homepage
      </h1>
      {hero && (
        <Hero
          backgroundImage={hero.background_image.data?.attributes.url ?? ""}
          title={hero.title}
          description={hero.description}
          buttons={hero.buttons}
        />
      )}
      <CategorySection />
      {twoColumnContentData?.map((content) => (
        <TwoColumnContentSection key={content.id} {...content.attributes} />
      ))}
    </>
  );
};
