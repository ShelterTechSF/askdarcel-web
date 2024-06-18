import imageUrlBuilder from "@sanity/image-url";
import React from "react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import { client } from "../../../sanity";
import { Button } from "../inline/Button/Button";
import styles from "./OppEventCardSection.module.scss";
import { OppEventCard } from "../Cards/OppEventCard";

export interface EventData {
  slug: {
    current: string;
    _type: string;
  };
  image: SanityImageSource;

  /* Event Types*/
  title?: string;
  date?: {
    endDate: Date;
    startDate: Date;
    _type: string;
  };

  /* Opportunity Types*/
  name?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface OppEventCardData {
  header: string;
  subheader?: string;
  backgroundColor: string;
  link?: {
    label: string;
    href: string;
  };
  opportunityCards?: EventData[];
  eventCards?: EventData[];
}

interface OppEventCardSectionProps {
  sectionType: "event" | "opportunity";
  sectionData: OppEventCardData;
}

export const OppEventCardSection = (props: OppEventCardSectionProps) => {
  const { sectionType, sectionData } = props;
  const { header, subheader, backgroundColor, link } = sectionData;
  const builder = imageUrlBuilder(client);

  if (!sectionData) {
    return <div>Loading...</div>;
  }

  const cardData = sectionData.opportunityCards || sectionData.eventCards;

  return (
    <div className={`${styles.oppEventSection} ${styles[backgroundColor]}`}>
      <div className={`${styles.oppEvent__header}`}>
        <div>
          <h2>{header}</h2>
          {subheader && <p>{subheader}</p>}
        </div>

        {link && (
          <Button href={link.href} arrowVariant="after">
            {link.label}
          </Button>
        )}
      </div>

      <div className={`${styles.cardsContainer} ${styles[sectionType]}`}>
        {cardData?.map((event): JSX.Element => {
          const { title, name, slug, date, start_date, end_date, image } =
            event;
          const cardImage = builder.image(image).url();

          return (
            <OppEventCard
              key={title || name}
              title={title || name}
              slug={slug.current}
              startDate={date?.startDate || start_date}
              endDate={date?.endDate || end_date}
              image={cardImage}
              sectionType={sectionType}
            />
          );
        })}
      </div>
    </div>
  );
};
