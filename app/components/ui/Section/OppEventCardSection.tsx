import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import { HomePageSection } from "pages/HomePage/components/Section";
import { Slug } from "pages/HomePage/components/Section/Section";
import React from "react";
import { client } from "../../../sanity";
import { OppEventCard } from "../Cards/OppEventCard";
import styles from "./OppEventCardSection.module.scss";
import { Loader } from "../Loader";

export interface EventData {
  slug: Slug;
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
  link: {
    label: string;
    slug: Slug;
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
    return <Loader />;
  }

  const cardData = sectionData.opportunityCards || sectionData.eventCards;

  return (
    <HomePageSection
      title={header}
      description={subheader}
      backgroundColor={backgroundColor}
      link={link}
    >
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
    </HomePageSection>
  );
};
