import React from "react";
import { FooterLinkType } from "./Footer";
import { Link } from "react-router-dom";

interface FooterLinkProps {
  link: FooterLinkType;
}

export const FooterLink = ({ link }: FooterLinkProps) => {
  const isInternalLink = (url: string): boolean => {
    return url.startsWith("/") || url.startsWith(window.location.origin);
  };

  if (isInternalLink(link.href)) {
    return <Link to={link.href}>{link.label}</Link>;
  } else {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
};
