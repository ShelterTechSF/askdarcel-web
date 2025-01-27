import React from "react";
import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { useHomePageEventsData, useHomepageData } from "hooks/StrapiAPI";
import { Homepage, StrapiDatum } from "models/Strapi";
import { EventCardSection } from "components/ui/Cards/EventCardSection";
import { HomePageSection } from "pages/HomePage/components/Section";
import { TwoColumnContentSection } from "components/ui/TwoColumnContentSection/TwoColumnContentSection";

export const HomePage = () => {
  const { data: homepageData, isLoading: homepageDataIsLoading } =
    useHomepageData();
  const { data: eventsData, isLoading: eventsAreLoading } =
    useHomePageEventsData();

  const homepageDataRes = homepageData as StrapiDatum<Homepage>;

  const homePageDataAttrs = homepageDataRes?.attributes;

  if (homepageDataIsLoading || eventsAreLoading) {
    return null;
  }

  const { hero, two_column_content_block } = homePageDataAttrs || {};

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
      {eventsData && (
        <HomePageSection
          title={"Upcoming events"}
          description={""}
          backgroundColor={"tertiary"}
        >
          <EventCardSection events={eventsData} />
        </HomePageSection>
      )}

      {two_column_content_block?.map((content) => (
        <TwoColumnContentSection key={content.id} {...content} />
      ))}
    </>
  );
};
