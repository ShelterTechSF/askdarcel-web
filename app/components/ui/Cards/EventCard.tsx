import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { formatCalendarEventDisplay } from "components/ui/Cards/FormattedDate";
import styles from "./EventCard.module.scss";
import { EventResponse } from "hooks/StrapiAPI";

export const EventCard = ({ event }: { event: EventResponse }) => {
  const { calendar_event: calendarEvent, title, image, page_link } = event;
  const imageUrl = image?.data?.attributes?.url;
  const imageAlternativeText = image?.data?.attributes.alternativeText || "";
  const linkUrl = page_link?.url;

  const formattedDate = calendarEvent?.startdate
    ? formatCalendarEventDisplay(calendarEvent)
    : null;

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
          <h3 className={styles.contentTitle}>
            <a
              href={linkUrl}
              data-testid={"eventcard-link"}
              // While events are external links:
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>
          </h3>
          {calendarEvent && calendarEvent?.startdate && (
            <div className={styles.contentTime}>
              <p data-testid="eventcard-formatteddate">{formattedDate}</p>
            </div>
          )}
        </div>

        <Button
          arrowVariant="after"
          variant="linkBlue"
          size="lg"
          mobileFullWidth={false}
          isVisualOnly
        >
          View more
        </Button>
      </div>
    </div>
  );
};
