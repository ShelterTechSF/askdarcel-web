import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useLocation } from "react-router-dom";
import Checklist from "assets/img/domestic-violence-checklist.png";
import type { PhoneNumber } from "../../models/Meta";

import { whiteLabel } from "utils";

import {
  fetchService,
  getServiceLocations,
  RecurringSchedule,
  Service,
} from "../../models";
import { Address } from "../../models/Meta";

import styles from "./styles.module.scss";

// Note: Much of the code/styling/components in this file were copied over from the Service
// Listing Page. This file is a standalone file that exists to render PDFs of service data.
// It should not be referenced elsewhere.
// Once this component has rendered, an effect hook is run that gets the HTML of this component
// and passes it to our Rails API which then relays the HTML to an HTML to PDF conversion 3rd party
// API. The PDF is passed back to the client and is then displayed

export const IntimatePartnerViolencePdfPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [pdfSource, setPdfSource] = useState("");

  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const targetLangCode = urlParams.get("handoutLanguage");

  const ref = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    if (id) {
      fetchService(id).then((s) => {
        setService(s);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!pdfSource && ref.current) {
      // The below lines compress the CSS contained in the style element so as to decrease
      // the character count that is sent to the Translation API
      // https://dev.to/derder56/how-to-build-a-css-minifier-with-8-lines-of-javascript-4bj3
      const styleElement = styleRef.current;
      if (styleElement) {
        styleElement.innerHTML = styleElement.innerHTML
          .replace(/([^0-9a-zA-Z.#])\s+/g, "$1")
          .replace(/;}/g, "}")
          .replace(/\/\*.*?\*\//g, "");
      }

      fetch(`/api/services/html_to_pdf`, {
        body: JSON.stringify({
          html: ref.current?.outerHTML,
          target_language: targetLangCode,
        }),
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      })
        .then((resp) => resp.blob())
        .then((blob) => {
          setPdfSource(window.URL.createObjectURL(blob));
        });
    }
  });

  if (!service) {
    return <Loader />;
  }

  const { resource, recurringSchedule } = service;
  const locations = getServiceLocations(service, resource, recurringSchedule);
  const checklistItems = ['Spending time with supportive friends and family', "Thinking about what you feel grateful for", "Prayer", "Counseling", "Exercise", "Helping others", "Listening to music", "Other: __________________"]

  return (
    <div>
      {pdfSource && (
        <embed
          src={pdfSource}
          type="application/pdf"
          height="100%"
          width="100%"
          className={styles.pdfEmbed}
        />
      )}
      {!pdfSource && (
        <>
          <p className={styles.loaderText}>Generating PDF</p>
          <Loader />
        </>
      )}
      {!pdfSource && (
        <div
          ref={ref}
          className={`serviceHandoutPdf ${styles.handoutInvisible}`}
        >
          {/* The below styles contain some overrides of global .renderedMarkdown and table tag selector styles */}
          <style className="notranslate" ref={styleRef}>
            {`

          @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

          .serviceHandoutPdf * {
            margin: 0;
            font-family: "Open Sans", "San Francisco", "Roboto", "Arial", sans-serif;
            color: #000;
          }

          .serviceHandoutPdf {
            padding: 0 4px 9px;
            background-color: #fff;
          }

          .compactHeader {
            padding-left: 0;
          }

          .serviceHandoutPdf table tr th {
            font-weight: bold;
            color: #666;
            padding: 9px 9px 5px;
            text-align: left;
          }

          .serviceHandoutPdf table tr td {
            padding: 7px 7px 6px;
            text-align: left;
          }

          .serviceHandoutPdf table tr td ul {
            padding: 0;
            list-style: none;
            text-align: left;
          }

          .titleSection {
            display: grid;
            gap: 6px;
            border-bottom: solid 3px #31adb5;
            padding-bottom: 9px;
          }

          .serviceTitle {
            color: #31adb5;
            font-weight: 600;
            font-size: 30px;
            line-height: 1;
          }

          .subtitle {
            font-style: italic;
            margin-bottom: 6px;
          }

          .renderedMarkdown strong {
            font-weight: 600;
            color: #666;
          }

          .renderedMarkdown em {
            font-style: italic;
          }

          .renderedMarkdown ol,
          .renderedMarkdown ul {
            padding: 6px 18px;
          }

          .renderedMarkdown ul li {
            list-style-type: disc;
          }

          .renderedMarkdown li ul {
            padding: 0px 18px;
          }

          .renderedMarkdown ol li {
            list-style-type: decimal;
          }

          .renderedMarkdown p strong {
            color: #30383a;
          }

          .renderedMarkdown h1 {
            font-size: 16px;
            font-family: "Open Sans", "San Francisco", "Roboto", "Arial", sans-serif;
          }

          .locationContainer {
            display: grid;
            grid-template-columns: auto 6fr;
            gap: 9px;
            align-items: center;
            justify-items: end;
          }

          .contentContainer {
            display: grid;
            grid-template-columns: 47fr 53fr;
            gap: 18px;
          }

          .rightColumn,
          .leftColumn {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }

          .leftColumn {
            z-index: 1;
          }

          .checklistContainer {
            position: relative;
            margin-left: -20px;
          }

          .checklistBody {
            position: absolute;
            top: 65px;
            bottom: 15px;
            left: 75px;
            right: 35px;
          }

          .checklistContainer,
          .checklistImage {
            width: 400px;
            height: auto;
          }

          .checklistHeader {
            font-weight: 700;
            margin-bottom: 18px;
          }

          .checklist {
            display: grid;
            gap: 6px;
            margin: 0;
            padding: 0;
          }

          .checklistItem {
            line-height: 1.3;
            font-family: 'Architects Daughter', cursive;
            font-weight: 500;
            display: flex;
            gap: 6px;
            flex-direction: row;
            margin: 0;
            padding: 0;
          }

          .checkbox {
            position: relative;
            flex-shrink: 0;
            width: 20px;
            height: 20px;
          }

          .checkboxBackground {
            position: absolute;
            background-color: white;
            top: -1px;
            left: 0;
            right: -1px;
            bottom: 0;
            border-radius: 33%;
          }

          .checkboxBorder {
            border: solid 1px black;
            border-radius: 3px;
            z-index: 1;
            position: relative;
            height: 100%;
          }

          .blurb {
            margin-top: 30px;
            display: grid;
            gap: 22px;
          }

          .introSentence {
            font-weight: 600;
          }

          .resourceItemContact {
            font-weight: 600;
            display: inline-block;
            white-space: nowrap;
          }

          .resourceItemContact.contactNewLine {
            display: block;
          }

          .generalResources {
            border: solid 2px #a6a6a6;
            border-radius: 10px;
            padding: 18px 15px;
            list-style: none;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-top: auto;
            gap: 18px;
          }

          .generalResourceHeader {
            color: #311b76;
            font-weight: 400;
            font-size: 22px;
            margin-bottom: 10px;
          }

          .generalResourceList {
            margin: 0;
            padding: 0;
            list-style-position: inside;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .generalResourceItem {
            display: flex;
            gap: 12px;
            align-items: baseline;
          }

          .generalResourceItem::before {
            content: "";
            flex-shrink: 0;
            background-color: #F3911E;
            display: inline-block;
            height: 8px;
            width: 8px;
            border-radius: 50%;
          }

          .recommendedResource {
            margin-top: 20px;
            margin-left: 18px;
            border: solid 2px #a6a6a6;
            border-radius: 10px;
            padding: 18px 15px;
            flex-grow: 1;
            margin-top: auto;
          }

          .resourceContent {
            display: grid;
            gap: 12px;
          }

          .serviceName {
            color: #31adb5;
            font-weight: 800;
          }

          .sampleResource {
            color: #31adb5;
            font-weight: 800;
          }

          .descriptionContainer {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            line-height: 1.5;
            overflow: hidden;
            -webkit-mask-image: linear-gradient(180deg, #000 56%, transparent);
          }

          .serviceUrl {
            margin-top: 4px;
            font-size: 14px;
            font-style: italic;
          }

          .resourceName {
            font-weight: 600;
          }

          .serviceHours {
            margin-top: 18px;
          }

          .serviceHours table.compact tr th,
          .serviceHours table.compact tr td {
            padding: 0 0 1px;
          }

          .serviceHours table.compact tr .compactData {
            padding-left: 8px;
          }

          .serviceHours table tr th {
            font-weight: 600;
          }

          .hoursTitle {
            font-weight: 600;
            text-decoration: underline;
            margin-bottom: 2px;
          }
        `}
          </style>
          <header className="titleSection">
            <h1 className="serviceTitle notranslate">
              San Francisco Resources
            </h1>
            <p className="subTitle" style={{ fontStyle: "italic" }}>
              You deserve safety and respect
            </p>
          </header>
          <div className="contentContainer">
            <div className="leftColumn">
              <div className="blurb">
                <p className="introParagraph">
                  Your relationships and experiences affect your health and
                  well-being.
                </p>
                <p className="introParagraph">
                  <span className="introSentence">
                    We are here to support you!
                  </span>{" "}
                  Free and confidential help is available. No insurance or
                  citizenship requirements.
                </p>
              </div>
              <ul className="generalResources">
                {generalResources.map((r) => (
                  <li key={r.header}>
                    <GeneralResource
                      header={r.header}
                      resourceItems={r.resourceItems}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rightColumn">
              <div className="checklistContainer">
                <div className="checklistBody">
                  <p className="checklistHeader">
                    What have you tried in the past 30 days to cope or feel
                    better:
                  </p>
                  <ul className="checklist">
                    {checklistItems.map((item) => (
                      <li key={item} className="checklistItem">
                        <div className="checkbox">
                          <div className="checkboxBorder" />
                          <div className="checkboxBackground" />
                        </div>

                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <img
                  className="checklistImage"
                  src="https://i.ibb.co/17PF7ZP/domestic-violence-checklist.png"
                  alt=""
                />
              </div>
              <div className="recommendedResource">
                <div className="resourceContent">
                  <div>
                    <p className="sampleResource">Sample Resource:</p>
                    <p className="serviceName">{service.name}</p>
                  </div>

                  <div>
                    <div className="descriptionContainer">
                      <ReactMarkdown
                        className="renderedMarkdown"
                        source={service.long_description}
                        linkTarget="_blank"
                      />
                    </div>
                  </div>

                  <div className="locationInfo">
                    {locations.length > 0 && (
                      <div className="locationContainer">
                        <div className="addressInfo">
                          <ServiceAddress
                            address={locations[0].address}
                            resourceName={service.resource.name}
                            phones={service.resource.phones}
                          />
                          <div className="serviceHours">
                            <p className="hoursTitle">Hours</p>
                            <TableOfOpeningTimes
                              recurringSchedule={locations[0].recurringSchedule}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ResourceItem {
  description: string;
  contact: string;
  contactNewLine?: boolean;
}

interface GeneralResourceItem {
  header: string;
  resourceItems: ResourceItem[];
}

const generalResources: GeneralResourceItem[] = [
  {
    header: "GET CONNECTED TO PRIMARY CARE",
    resourceItems: [
      {
        description:
          "SF Health Network New Patient Appointment (SFHP MediCal / MediCal FFS):",
        contact: "415-682-1740",
      },
    ],
  },
  {
    header: "FIND COMMUNITY RESOURCES",
    resourceItems: [
      {
        description: "Behavioral Health Access Center Mon-Fri  9am-4pm",
        contact: "415-255-3737 or 888-246-3333",
      },
      {
        description:
          "24/7 Information and Referrals for food, shelter, child care, senior services, etc.",
        contact: "Call 3–1–1",
      },
    ],
  },
  {
    header: "24/7 HOTLINES",
    resourceItems: [
      {
        description: "Suicide and Crisis Lifeline",
        contact: "988 or 415-781-0500",
        contactNewLine: true,
      },
      {
        description: "La Casa de Las Madres",
        contact: "877-503-1850",
        contactNewLine: true,
      },
      {
        description: "W.O.M.A.N. Inc",
        contact: "\n877-384-3578",
        contactNewLine: true,
      },
    ],
  },
];

const GeneralResource = ({
  header,
  resourceItems,
}: {
  header: string;
  resourceItems: ResourceItem[];
}) => (
  <>
    <h3 className="generalResourceHeader">{header}</h3>
    <ul className="generalResourceList">
      {resourceItems.map((item) => (
        <li className="generalResourceItem" key={item.contact}>
          <span>
            {item.description}{" "}
            <span
              className={`resourceItemContact ${
                item.contactNewLine ? "contactNewLine" : ""
              }`}
            >
              {item.contact}
            </span>
          </span>
        </li>
      ))}
    </ul>
  </>
);

type ServiceAddressProps = {
  resourceName: string;
  address: Address;
  website?: string | null;
  phones: PhoneNumber[];
};

const ServiceAddress = ({
  resourceName,
  address,
  website,
  phones,
}: ServiceAddressProps) => {
  const { address_1, address_2, city, state_province, postal_code } = address;
  const phone = phones?.[0];
  return (
    <div>
      <p className="resourceName">{resourceName}</p>
      <p>
        <span>{address_1}</span>
        {address_2 && (
          <span>
            <span> </span>
            <span>{address_2}</span>
          </span>
        )}
      </p>
      <p>
        <span>{city}</span>, <span>{state_province}</span>{" "}
        <span>{postal_code}</span>
      </p>
      <p>
        <span>{phone.number}</span>{" "}
        {phone.service_type && `(${phone.service_type})`}
      </p>
      {website && <p>{website}</p>}
    </div>
  );
};

const TableOfOpeningTimes = ({
  recurringSchedule,
}: {
  recurringSchedule: RecurringSchedule;
}) => (
  // NB This component was copied from our compoonents directory to be used
  // in this file so that future developers would not need to worry about this file
  // when updating our code
  <table className="compact">
    <tbody>
      {(recurringSchedule.hoursKnown &&
        recurringSchedule.intervals.map((interval) => {
          const opensAt = interval.opensAt.timeString();
          const closesAt = interval.closesAt.timeString();
          return (
            <tr
              key={interval.key()}
              data-cy="opening-times-row"
              className="compactRow"
            >
              <th className="compactHeader openDay">
                {interval.opensAt.dayString()}
              </th>
              <td className="compactData">{`${opensAt} - ${closesAt}`}</td>
            </tr>
          );
        })) || (
        <tr>
          <th>Call for Hours</th>
        </tr>
      )}
    </tbody>
  </table>
);

const Loader = () => (
  // NB This component was copied from our compoonents directory to be used
  // in this file so that future developers would not need to worry about this file
  // when updating our code
  <div className="loader">
    <div className="sk-fading-circle">
      <div className="sk-circle1 sk-circle" />
      <div className="sk-circle2 sk-circle" />
      <div className="sk-circle3 sk-circle" />
      <div className="sk-circle4 sk-circle" />
      <div className="sk-circle5 sk-circle" />
      <div className="sk-circle6 sk-circle" />
      <div className="sk-circle7 sk-circle" />
      <div className="sk-circle8 sk-circle" />
      <div className="sk-circle9 sk-circle" />
      <div className="sk-circle10 sk-circle" />
      <div className="sk-circle11 sk-circle" />
      <div className="sk-circle12 sk-circle" />
    </div>
  </div>
);
