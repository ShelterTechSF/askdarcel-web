import { HomePageSection } from "pages/HomePage/components/Section";
import React from "react";
import { EventCard } from "./EventCard";
import styles from "./EventCardSection.module.scss";
import { Loader } from "../Loader";
import { EventResponse } from 'hooks/StrapiAPI';

interface EventCardSectionProps {
  events?: EventResponse[];
}

export const EventCardSection = (props: EventCardSectionProps) => {
  const { events } = props;

  if (!events) {
    return <Loader />;
  }

  return (
    <HomePageSection
      title={'Upcoming events'}
      description={'Description text eplaining this section'}
      backgroundColor={"tertiary"}
    >
      {events && (
        <div className={styles.cardsContainer}>
          {events?.map((eventData) => (
            <EventCard
              event={eventData}
            />
          ))}
        </div>
      )}
    </HomePageSection>
  );
};
