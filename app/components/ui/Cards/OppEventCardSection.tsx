import { HomePageSection } from "pages/HomePage/components/Section";
import React from "react";
import { OppEventCard } from "../Cards/OppEventCard";
import styles from "./OppEventCardSection.module.scss";
import { Loader } from "../Loader";
import { Event } from "models/Strapi";
import { EventResponse } from 'hooks/StrapiAPI';

interface OppEventCardSectionProps {
  events?: EventResponse[];
}

export const OppEventCardSection = (props: OppEventCardSectionProps) => {
  const { events } = props;

  if (!events) {
    return <Loader />;
  }

  return (
    <HomePageSection
      title={'Upcoming events'}
      description={'Description text eplaining this section'}
      backgroundColor={"primary"}
    >
      {events && (
        <div className={styles.cardsContainer}>
          {events?.map((eventData) => (
            <OppEventCard
              event={eventData}
            />
          ))}
        </div>
      )}
    </HomePageSection>
  );
};
