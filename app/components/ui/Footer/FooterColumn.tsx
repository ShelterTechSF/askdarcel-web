import { DynamicLink } from "models/Strapi";
import React from "react";
import { FooterLink } from "./FooterLink";

export const FooterColumn = ({ column }: { column: DynamicLink }) => {
  return (
    <figure>
      <figcaption>{column.title}</figcaption>
      <ul>
        {column.link.map((link) => (
          <li key={link.text}>
            <FooterLink link={link} />
          </li>
        ))}
      </ul>
    </figure>
  );
};
