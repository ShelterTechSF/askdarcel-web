import React from "react";
import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { useEventsData, useHomepageData } from "hooks/StrapiAPI";
import { Event, Homepage, StrapiDatum } from "models/Strapi";
import { TwoColumnContentSection } from "components/ui/TwoColumnContentSection/TwoColumnContentSection";
import { EventCard } from 'components/ui/Cards/EventCard';
import { EventCardSection } from 'components/ui/Cards/EventCardSection';
// import { EventCard } from 'components/ui/Cards/EventCard';

export const HomePage = () => {
  const { data: homepageData, isLoading: homepageDataIsLoading } = useHomepageData();
  const { data: eventsData, isLoading: eventsAreLoading } = useEventsData();
  console.log("🪵 ~ HomePage ~ eventsData:", eventsData);

  const homepageDataRes = homepageData as StrapiDatum<Homepage>;

  const homePageDataAttrs = homepageDataRes?.attributes;


  if (homepageDataIsLoading || eventsAreLoading) {
    return null;
  }

  const { hero, two_column_content_blocks } = homePageDataAttrs || {};
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
      {eventsData &&
      <EventCardSection
        events={eventsData}
      />
      }

      {twoColumnContentData?.map((content) => (
        <TwoColumnContentSection key={content.id} {...content.attributes} />
      ))}
    </>
  );
};
