import React, { useEffect, useState } from "react";
import whiteLabel from "utils/whitelabel";
import { callableUSPhoneNumber } from "utils/numbers";
import { htmlWithBreaks } from "utils/sanity";
import Our415Logo from "assets/img/our415-white.png";
import SFSeal from "assets/img/sf-seal-white.png";
import DCYFLogo from "assets/img/dcyf-white.png";
import { FooterColumn } from "./FooterColumn";
import { client } from "../../../sanity";

import "./Footer.scss";

export interface FooterLinkType {
  href: string;
  label: string;
}

export interface FooterColumnType {
  title: string;
  links: FooterLinkType[];
}

export interface FooterData {
  address: string;
  email: string;
  phoneNumber: string;
  column1: FooterColumnType;
  column2: FooterColumnType;
  column3: FooterColumnType;
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
      const result: FooterData = await client.fetch(query);
      setFooterData(result);
    };

    fetchFooterData();
  }, []);

  if (!footerData) {
    return <div>Loading...</div>;
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__content">
        <div className="site-footer__top">
          <div className="site-footer__contact">
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
            <div className="site-footer__dcyf">
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
