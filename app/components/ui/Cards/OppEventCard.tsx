import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { StrapiModel } from "models/Strapi";
import { FormattedDate } from "components/ui/Cards/FormattedDate";
import styles from "./OppEventCard.module.scss";

interface OppEventCardProps {
  details: {
    id: string;
    imageUrl: string | null;
    title: string;
    calendarEvent: StrapiModel.CalendarEvent;
  };
  sectionType: "event" | "opportunity";
}

export const OppEventCard = (props: OppEventCardProps) => {
  const {
    details: { title, id, calendarEvent, imageUrl },
    sectionType,
  } = props;
  return (
    <div className={`${styles.oppEventCard} ${styles[sectionType]}`}>
      {imageUrl ? (
        <img
          alt={title}
          src={imageUrl}
          className={`${styles.cardImage} ${styles[sectionType]}`}
        />
      ) : (
        <div className={`${styles.cardImage} ${styles[sectionType]}`}>
          <i className="fa-solid fa-image" />
        </div>
      )}

      <div className={styles.content}>
        <div>
          <h4 className={styles.contentTitle}>
            <a href={id}>{title}</a>
          </h4>
          {calendarEvent && (
            <div className={styles.contentTime}>
              <FormattedDate calendarEvent={calendarEvent} />
            </div>
          )}
        </div>

        <Button arrowVariant="after" variant="linkBlue" size="lg">
          View more
        </Button>
      </div>
    </div>
  );
};
