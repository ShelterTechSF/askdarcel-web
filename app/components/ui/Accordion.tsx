import React, { useState } from "react";
import "./Accordion.scss";

export const Accordion = <T,>({
  items,
  getKey,
  headerRenderer,
  sectionRenderer,
}: {
  items: T[];
  getKey: (item: T) => string | number;
  headerRenderer: (item: T, index: number) => React.ReactNode;
  sectionRenderer: (item: T) => React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ul className="accordion">
      {items.map((item, i) => (
        <li // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
          className={activeTab === i ? "open" : "closed"}
          onClick={() => setActiveTab(i)}
          key={getKey(item)}
        >
          <header>{headerRenderer(item, i)}</header>
          <section>{activeTab === i ? sectionRenderer(item) : null}</section>
        </li>
      ))}
    </ul>
  );
};
