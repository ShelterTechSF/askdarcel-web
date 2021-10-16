import React, { useState } from 'react';
import './Accordion.scss';

export const Accordion = ({ children }: { children: JSX.Element[] }) => {
  const [activeTab, setActiveTab] = useState(children[0].key);

  return (
    <ul className="accordion">
      {
        children.map(ch => (
          <li // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
            className={activeTab === ch.key ? 'open' : 'closed'}
            onClick={() => setActiveTab(ch.key)}
            key={ch.key}
          >
            { ch }
          </li>
        ))
      }
    </ul>
  );
};

// TODO Enforcing the user to add their own dropdown with a custom renderer is a bit clunky
export const AccordionItem = ({ children, headerRenderer, title }: {
  title: string;
  headerRenderer?: JSX.Element;
  children: JSX.Element;
}) => (
  <div>
    <header>
      { headerRenderer || title }
    </header>
    <section>{ children }</section>
  </div>
);
