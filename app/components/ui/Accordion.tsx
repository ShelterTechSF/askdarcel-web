import React, { useState } from "react";
import "./Accordion.scss";

export const Accordion = ({ children }: { children: JSX.Element[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ul className="accordion">
      {children.map((ch, i) => (
        <li // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
          className={activeTab === i ? "open" : "closed"}
          onClick={() => setActiveTab(i)}
          key={ch.key}
        >
          {React.cloneElement(ch, { isOpen: activeTab === i })}
        </li>
      ))}
    </ul>
  );
};

// TODO Enforcing the user to add their own dropdown with a custom renderer is a bit clunky
export const AccordionItem = ({
  children,
  headerRenderer,
  isOpen = false,
}: {
  headerRenderer?: JSX.Element;
  children: JSX.Element;
  isOpen?: boolean;
}) => (
  <div>
    <header>{headerRenderer}</header>
    <section>{isOpen ? children : null}</section>
  </div>
);
