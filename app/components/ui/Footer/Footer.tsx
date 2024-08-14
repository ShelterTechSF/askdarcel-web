import React from "react";
import { callableUSPhoneNumber } from "utils/numbers";
import { htmlWithBreaks } from "utils/cms";
import Our415Logo from "assets/img/our415-white.png";
import SFSeal from "assets/img/sf-seal-white.png";
import DCYFLogo from "assets/img/dcyf-white.png";
import { StrapiModel } from "models/Strapi";
import { FooterColumn } from "./FooterColumn";
import { useFooterData } from "../../../hooks/StrapiAPI";

import "./Footer.scss";

export const Footer = () => {
  const { data, error, isLoading } = useFooterData();

  const res = data as StrapiModel.StrapiDatum<StrapiModel.Footer>;

  const footerData = res?.attributes;

  if (isLoading) {
    return null;
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
            {!error && data && (
              <address>
                <div
                  className="site-footer__address"
                  dangerouslySetInnerHTML={{
                    __html: htmlWithBreaks(footerData.address),
                  }}
                />
                <div className="site-footer__contact">
                  <a
                    href={`tel:${callableUSPhoneNumber(
                      footerData.phone_number
                    )}`}
                  >
                    {footerData.phone_number}
                  </a>
                  <br />
                  <a href={`mailto:${footerData.email_address}`}>
                    {footerData.email_address}
                  </a>
                </div>
              </address>
            )}
          </div>

          <div className="site-footer__links">
            {!error &&
              footerData?.links.map((item: StrapiModel.DynamicLink) => (
                <FooterColumn key={item.id} column={item} />
              ))}
          </div>
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
