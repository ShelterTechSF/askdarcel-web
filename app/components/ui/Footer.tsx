import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import whiteLabel from "../../utils/whitelabel";
import Our415Logo from "../../assets/img/our415-white.png";
import SFSeal from "../../assets/img/sf-seal-white.png";
import DCYFLogo from "../../assets/img/dcyf-white.png";
import { client } from "../../sanity";

import "./Footer.scss";

export const Footer = () => {
  const { title, footerOptions } = whiteLabel;
  const [footerData, setFooterData] = useState(null);

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

  console.log(footerData);

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__content">
        <div className="site-footer__top">
          {/* {footerOptions.showTitle && (
            <section className="service-guide">
              <div className="service-guide__icon" />
              <h1 className="service-guide__text">
                <Link to="/">{title}</Link>
              </h1>
            </section>
          )} */}
          <div className="site-footer__left">
            <div className="site-footer__logo">
              <img
                src={Our415Logo}
                alt="SF Department of Children Youth and their Families"
              />
            </div>
            <address>
              <div className="site-footer__address">
                1390 Market St, Suite 900,
                <br />
                San Francisco, CA 94102, USA
              </div>
              <div className="site-footer__contact">
                <a href="tel:+16286527100">628-652-7100</a>
                <br />
                <a href="mailto:info@dcyf.org">info@dcyf.org</a>
              </div>
            </address>
          </div>

          {footerOptions.showLinks && (
            <div className="site-footer__links">
              <figure>
                <figcaption>About</figcaption>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <a
                      href="https://help.sfserviceguide.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Submit a resource
                    </a>
                  </li>
                </ul>
              </figure>

              <figure>
                <figcaption>Follow Us</figcaption>
                <ul>
                  <li>
                    <a
                      href="https://www.facebook.com/ShelterTechOrg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/shelter_tech"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/sheltertechorg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      X
                    </a>
                  </li>
                </ul>
              </figure>

              <figure>
                <figcaption>Legal</figcaption>
                <ul>
                  <li>
                    <Link to="/terms-of-service">Terms of Service</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </li>
                </ul>
              </figure>
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
