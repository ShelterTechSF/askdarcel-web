import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import whiteLabel from "../../utils/whitelabel";
import Our415Logo from "../../assets/img/our415-white.png";
import SFSeal from "../../assets/img/sf-seal-white.png";
import DCYFLogo from "../../assets/img/dcyf-white.png";
import { client } from "../../sanity";

import "./Footer.scss";

interface FooterLink {
  href: string;
  label: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}
interface FooterData {
  address: string;
  email: string;
  phoneNumber: string;
  column1: FooterColumn;
  column2: FooterColumn;
  column3: FooterColumn;
}

export const Footer = () => {
  const { footerOptions } = whiteLabel;
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const query = `*[_type == "footer"][0]{
        address,
        email,
        phoneNumber,
        column1,
        column2,
        column3
      }`;
      const result = await client.fetch(query);
      setFooterData(result);
    };

    fetchFooterData();
  }, []);

  if (!footerData) {
    return <div>Loading...</div>;
  }

  const htmlWithBreaks = (htmlString: string) => {
    return htmlString.replace(/\n/g, "<br>");
  };

  const callableUSPhoneNumber = (phoneNumber: string) => {
    const numbersOnly = phoneNumber.replace(/\D/g, "");
    const formattedNumber = `+1${numbersOnly}`;
    return formattedNumber;
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__content">
        <div className="site-footer__top">
          <div className="site-footer__left">
            <div className="site-footer__logo">
              <img
                src={Our415Logo}
                alt="SF Department of Children Youth and their Families"
              />
            </div>
            <address>
              <div
                className="site-footer__address"
                dangerouslySetInnerHTML={{
                  __html: htmlWithBreaks(footerData.address),
                }}
              />
              <div className="site-footer__contact">
                <a
                  href={`tel:${callableUSPhoneNumber(footerData.phoneNumber)}`}
                >
                  {footerData.phoneNumber}
                </a>
                <br />
                <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
              </div>
            </address>
          </div>

          {footerOptions.showLinks && (
            <div className="site-footer__links">
              <FooterColumn column={footerData.column1} />
              <FooterColumn column={footerData.column2} />
              <FooterColumn column={footerData.column3} />
            </div>
          )}
          <div className="site-footer__logos">
            <div className="site-footer__sfseal">
              <img src={SFSeal} alt="City of San Francisco Seal" />
            </div>
            <div className="site-footer__dcyf-center">
              <img
                src={DCYFLogo}
                alt="SF Department of Children Youth and their Families"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterColumnProps {
  column: FooterColumn;
}

export const FooterColumn = ({ column }: FooterColumnProps) => {
  return (
    <figure>
      <figcaption>{column.title}</figcaption>
      <ul>
        {column.links.map((link, index) => (
          <li key={index}>
            <FooterLink link={link} />
          </li>
        ))}
      </ul>
    </figure>
  );
};

interface FooterLinkProps {
  link: FooterLink;
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
