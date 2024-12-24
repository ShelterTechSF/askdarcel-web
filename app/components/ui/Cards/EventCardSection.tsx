import React from "react";
import { EventCard } from "./EventCard";
import styles from "./EventCardSection.module.scss";
import { Loader } from "../Loader";
import { formatHomePageEventsData } from "hooks/StrapiAPI";

export const EventCardSection = ({
  events,
}: {
  events: ReturnType<typeof formatHomePageEventsData>;
}) => {
  if (!events) {
    return <Loader />;
  }

  return (
    <>
      {events && (
        <div className={styles.cardsContainer}>
          {events?.map((eventData) => (
            <EventCard key={eventData.id} event={eventData} />
          ))}
        </div>
      )}
    </>
  );
};
