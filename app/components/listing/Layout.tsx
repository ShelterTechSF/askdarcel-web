import React from 'react';

export const ListingSection = ({ id, title, children }: {
  id: string
  title: string
  children: any
}) => (
  <section className={`${id}--section`} id={id}>
    <header className="service--section--header">
      <h4>{ title }</h4>
    </header>
    <div className={`${id}--column`}>
      { children }
    </div>
  </section>
);
