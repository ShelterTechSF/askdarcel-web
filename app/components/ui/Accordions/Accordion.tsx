import React, { useState } from "react";
import classNames from "classnames";
import styles from "./Accordion.module.scss";

/*
    Accordion built per a11y guidelines:
    https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
*/

interface FaqItem {
  question: string;
  answer: string;
}

type FaqItems = FaqItem[];

// TODO: use this for LocationTimesAccordion

const Accordion = ({ items }: { items: FaqItems }) => {
  const [expandedAccordionItems, setExpandedAccordionItems] = useState<{
    [key: number]: boolean;
  }>({});

  const handleExpandAccordionItemOnClick = (currentIndex: number) => {
    setExpandedAccordionItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [currentIndex]: !prevExpandedItems[currentIndex],
    }));
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, i) => {
        const isExpanded = expandedAccordionItems[i] || false;
        const headerId = `accordion${i}id`;
        const panelId = `sect${i}`;

        return (
          <div
            key={item.question}
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
                aria-label={item.question}
                id={headerId}
                onClick={() => handleExpandAccordionItemOnClick(i)}
              >
                <span className={styles.accordionTitle}>
                  {item.question}
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
              <div className={styles.accordionContent}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
