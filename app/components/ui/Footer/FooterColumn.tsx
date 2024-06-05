import React from "react";
import { FooterColumnType } from "./Footer";
import { FooterLink } from "./FooterLink";

interface FooterColumnProps {
  column: FooterColumnType;
}

export const FooterColumn = ({ column }: FooterColumnProps) => {
  return (
    <figure>
      <figcaption>{column.title}</figcaption>
      <ul>
        {column.links.map((link) => (
          <li key={link.label}>
            <FooterLink link={link} />
          </li>
        ))}
      </ul>
    </figure>
  );
};
