import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { FormattedDate } from "components/ui/Cards/FormattedDate";
import styles from "./OppEventCard.module.scss";
import { EventResponse } from 'hooks/StrapiAPI';

export const OppEventCard = ({event}: {event: EventResponse}) => {
  console.log("🪵 ~ OppEventCard ~ event:", event);
  const {
    id,
    calendar_event: calendarEvent,
    title,
    image,
  } = event;
  const imageUrl = image?.data?.attributes?.url;
  const imageAlternativeText = image?.data?.attributes.alternativeText || "";

  const fullSlug = `/events/${id}`;

  return (
    <div className={styles.oppEventCard}>
      <img
        alt={imageAlternativeText}
        src={imageUrl}
        className={styles.cardImage}
      />


      <div className={styles.content}>
        <div>
          <h4 className={styles.contentTitle}>
            <a href={fullSlug}>{title}</a>
          </h4>
          {calendarEvent && (
            <div className={styles.contentTime}>
              <FormattedDate calendarEvent={calendarEvent} />
            </div>
          )}
        </div>

        <Button arrowVariant="after" variant="linkBlue" size="lg" isVisualOnly>
          View more
        </Button>
      </div>
    </div>
  )
}
