import Hero from "components/ui/Hero/Hero";
import { CategorySection } from "components/ui/Section/CategorySection";
import { OppEventCardSection } from "components/ui/Section/OppEventCardSection";
import { TwoColumnContentSection } from "components/ui/TwoColumnContentSection/TwoColumnContentSection";
import React from "react";
import { StrapiModel } from "models/Strapi";
import { useHomepageData } from "hooks/StrapiAPI";

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
    </>
  );
};
