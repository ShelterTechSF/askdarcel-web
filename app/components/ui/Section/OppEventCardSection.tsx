import { HomePageSection } from "pages/HomePage/components/Section";
import React from "react";
import { OppEventCard } from "../Cards/OppEventCard";
import styles from "./OppEventCardSection.module.scss";
import { Loader } from "../Loader";
import { ContentBlock, Event, Opportunity } from "models/Strapi";

interface OppEventCardSectionProps {
  sectionType: "event" | "opportunity";
  sectionData: ContentBlock;
  events?: { attributes: Event }[];
  opportunities?: { attributes: Opportunity }[];
}

export const OppEventCardSection = (props: OppEventCardSectionProps) => {
  const { sectionType, sectionData, events, opportunities } = props;
  const { header, subheader, background_color, link } = sectionData;

  if (!sectionData) {
    return <Loader />;
  }

  return (
    <HomePageSection
      title={header}
      description={subheader}
      backgroundColor={background_color.color}
      link={link}
    >
      {events && (
        <div className={`${styles.cardsContainer} ${styles[sectionType]}`}>
          {events?.map((event): JSX.Element => {
            const { attributes } = event;
            const eventData = {
              title: attributes.title,
              id: attributes.id,
              calendarEvent: attributes.calendar_event,
              imageUrl: attributes.image?.image?.data?.attributes.url || null,
            };

            return (
              <OppEventCard
                key={eventData.title}
                details={eventData}
                sectionType={sectionType}
              />
            );
          })}
        </div>
      )}
      {opportunities && (
        <div className={`${styles.cardsContainer} ${styles[sectionType]}`}>
          {opportunities?.map((opp): JSX.Element => {
            const { attributes } = opp;
            const oppData = {
              title: attributes.title,
              id: attributes.id,
              calendarEvent: attributes.calendar_event,
              imageUrl: attributes.image?.image?.data?.attributes.url || null,
            };

            return (
              <OppEventCard
                key={oppData.title}
                details={oppData}
                sectionType={sectionType}
              />
            );
          })}
        </div>
      )}
    </HomePageSection>
  );
};
