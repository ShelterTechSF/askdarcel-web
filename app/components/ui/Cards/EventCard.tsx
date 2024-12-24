import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { formatCalendarEventDisplay } from "components/ui/Cards/FormattedDate";
import styles from "./EventCard.module.scss";
import { EventResponse } from "hooks/StrapiAPI";

export const EventCard = ({ event }: { event: EventResponse }) => {
  const { calendar_event: calendarEvent, title, image, link } = event;
  const imageUrl = image?.data?.attributes?.url;
  const imageAlternativeText = image?.data?.attributes.alternativeText || "";
  const linkUrl = link?.url;
  const formattedDate = formatCalendarEventDisplay(calendarEvent);

  return (
    <div className={styles.eventCard} data-testid={"eventcard"}>
      <img
        data-testid={"eventcard-title"}
        alt={imageAlternativeText}
        src={imageUrl}
        className={styles.cardImage}
      />

      <div className={styles.content}>
        <div>
          <h4 className={styles.contentTitle}>
            <a href={linkUrl} data-testid={"eventcard-link"}>
              {title}
            </a>
          </h4>
          {calendarEvent && (
            <div className={styles.contentTime}>
              <p data-testid="eventcard-formatteddate">{formattedDate}</p>
            </div>
          )}
        </div>

        <Button arrowVariant="after" variant="linkBlue" size="lg" isVisualOnly>
          View more
        </Button>
      </div>
    </div>
  );
};
