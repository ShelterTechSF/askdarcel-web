import imageUrlBuilder from "@sanity/image-url";
import React, { useEffect, useState } from "react";
import { client } from "../../../sanity";
import { OppEventCard } from "../Cards/OppEventCard";
import { Button } from "../inline/Button/Button";
import styles from "./OppEventCardSection.module.scss";

export interface EventData {
  slug: {
    current: string;
    _type: string;
  };
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };

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

export interface OppEventCardSectionProps {
  sectionType: "opportunity" | "event";
}
/* 
TODO: Future PRs
  - Pull in Sanity data for header, description, button text
  - Update Button to use global button component
    - Update header button and view more button
    - include link to opportunity/event page
*/

export const OppEventCardSection = (props: OppEventCardSectionProps) => {
  const { sectionType } = props;
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const builder = imageUrlBuilder(client);

  useEffect(() => {
    const fetchEventData = async () => {
      const fields = {
        event: "title, slug, date, image",
        opportunity: "name, slug, start_date, end_date, image",
      };
      const query = `*[_type == "${sectionType}"] | order(_createdAt desc)[0...4] { ${fields[sectionType]} }`;
    
      setIsLoading(true);
      const result: EventData[] = await client.fetch(query);
      setIsLoading(false);

      setEventData(result);
    };

    fetchEventData();
  }, [sectionType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!eventData) {
    return null;
  }

  return (
    <div className={`${styles.oppEventSection} ${styles[sectionType]}`}>
      <div className={`${styles.oppEvent__header} ${styles[sectionType]}`}>
        <div>
          <h2>
            {sectionType === "event" ? "Upcoming events" : "Open Opportunties"}
          </h2>
          <p>Description text explaining this section goes here.</p>
        </div>
        <Button>See all opportunities/events</Button>
      </div>

      <div className={`${styles.cardsContainer} ${styles[sectionType]}`}>
        {eventData.map((event): JSX.Element => {
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
