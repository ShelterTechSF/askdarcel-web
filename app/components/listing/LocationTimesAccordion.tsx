import React, { useState } from "react";
import { LocationDetails } from "models";
import classNames from "classnames";
import styles from "./LocationTimesAccordion.module.scss";
import { TableOfLocationTimes } from "./TableOfLocationTimes";

/*
    Accordion built per a11y guidelines:
    https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
*/

const LocationTimesAccordion = ({
  locations,
}: {
  locations: LocationDetails[];
}) => {
  const [expandedAccordionItems, setExpandedAccordionItems] = useState<{
    [key: number]: boolean;
  }>({ 0: true });

  const handleExpandAccordionItemOnClick = (currentIndex: number) => {
    setExpandedAccordionItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [currentIndex]: !prevExpandedItems[currentIndex],
    }));
  };

  return (
    <div className={styles.locationTimesAccordion}>
      {locations.map((location, i) => {
        const isExpanded = expandedAccordionItems[i] || false;
        const headerId = `accordion${i}id`;
        const panelId = `sect${i}`;

        return (
          <div
            key={location.id}
            className={classNames(
              styles.accordionItem,
              isExpanded && styles.activeItem
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isExpanded}
                className={styles.accordionButton}
                aria-controls={panelId}
                aria-label={location.address.address_1}
                id={headerId}
                onClick={() => handleExpandAccordionItemOnClick(i)}
              >
                <span className={styles.accordionTitle}>
                  {`${i + 1}. ${location.address.address_1}`}
                  <i
                    className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={styles.accordionPanel}
              hidden={!isExpanded}
            >
              <div className={styles.accordionContent}>
                <TableOfLocationTimes
                  recurringSchedule={location.recurringSchedule}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LocationTimesAccordion;
