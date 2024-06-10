import React from "react";
import styles from "./OppEventCard.module.scss";
import { OppEventDate } from "./OppEventDate";

interface OppEventCardProps {
  slug: string;
  image: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  sectionType: "event" | "opportunity";
}

export const OppEventCard = (props: OppEventCardProps) => {
  const { title, slug, startDate, endDate, image, sectionType } = props;

  return (
    <div className={`${styles.card} ${styles[sectionType]}`}>
      <img
        alt={title}
        src={image}
        className={`${styles.cardImage} ${styles[sectionType]}`}
      />

      <div className={styles.content}>
        <div>
          <h4 className={styles.contentTitle}>
            <a href={slug}>{title}</a>
          </h4>
          <div className={styles.contentTime}>
            <OppEventDate startDate={startDate} endDate={endDate} />
          </div>
        </div>

        <p className={styles.contentSubtext}>View more</p>
      </div>
    </div>
  );
};
