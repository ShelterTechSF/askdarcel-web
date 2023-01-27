import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import qs from "qs";
import {
  ServiceAttribution,
  TableOfContactInfo,
  TableOfOpeningTimes,
} from "components/listing";

import { Datatable, Loader } from "components/ui";
import config from "../../config";
import {
  fetchService,
  generateServiceDetails,
  getServiceLocations,
  Organization,
  Service,
} from "../../models";
import { Address } from "../../models/Meta";

import styles from "./styles.module.scss";

export const ServicePdfPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [pdfSource, setPdfSource] = useState("");
  const [mapImgSrc, setMapImgSrc] = useState<string | null>(null);
  const details = useMemo(
    () => (service ? generateServiceDetails(service) : []),
    [service]
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchService(id).then((s) => {
        setService(s);
      });
    }
  }, [id]);

  useEffect(() => {
    if (mapImgSrc !== null && !pdfSource) {
      // Map image has been fetched. We're now ready to make our request to the PDF conversion endpoint
      fetch(`/api/services/html_to_pdf`, {
        body: JSON.stringify({ html: ref.current?.outerHTML }),
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      })
        .then((resp) => resp.blob())
        .then((blob) => {
          setPdfSource(window.URL.createObjectURL(blob));
        });
    }
  }, [mapImgSrc, pdfSource]);

  if (!service) {
    return <Loader />;
  }

  const { resource, recurringSchedule } = service;
  const locations = getServiceLocations(service, resource, recurringSchedule);

  if (locations.length > 0 && mapImgSrc === null) {
    const { address_1, city, state_province, postal_code } =
      locations[0].address;

    // Use address rather than Lat/Lng as center. In some cases, a location may not have
    // lat/lng or it may not be updated with address change. Address seems to
    // be a safer value to access.
    const center = `${address_1}, ${city}, ${state_province}, ${postal_code}`;
    const baseMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const params = {
      center,
      zoom: "14",
      size: "375x225",
      markers: `color:0xff6821|${center}`,
      maptype: "roadmap",
      key: config.GOOGLE_API_KEY,
    };

    fetch(
      `${baseMapUrl}?${qs.stringify(params, { encodeValuesOnly: true })}`
    ).then((mapResp) => {
      setMapImgSrc(mapResp.url);
    });
  }

  return (
    <div>
      {pdfSource && (
        <embed
          src={pdfSource}
          type="application/pdf"
          height="100%"
          width="100%"
          style={{ height: "98vh" }}
        />
      )}
      {!pdfSource && (
        <>
          <p className={styles.loaderText}>Fetching PDF...</p>
          <Loader />
        </>
      )}
      ;
      {!pdfSource && (
        <div
          ref={ref}
          className={`serviceHandoutPdf ${styles.handoutInvisible}`}
        >
          {/* The below styles contain some overrides of global .renderedMarkdown and table tag selector styles */}
          <style>
            {`
          .serviceHandoutPdf * {
            margin: 0;
            font-family: "Open Sans", "San Francisco", "Roboto", "Arial", sans-serif;
          }

          .serviceHandoutPdf {
            padding: 0 9px 9px;
            background-color: #fff;
          }

          .serviceHandoutPdf table.compact tr th,
          .serviceHandoutPdf table.compact tr td {
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
            font-weight: 800;
            font-size: 24px;
            line-height: 1;
          }

          .subtitle {
            font-style: italic;
          }

          .aboutSection {
            padding: 12px 0;
          }

          .aboutSection h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #484848;
            padding-bottom: 6px;
          }

          .contactInfo table tr th,
          .contactInfo table tr td,
          .detailsSection table tr th,
          .detailsSection table tr td {
            padding-left: 0;
            padding-top: 0;
          }

          .contactInfo {
            padding-top: 5px;
          }

          .contactInfo h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #ff6821;
            padding-bottom: 6px;
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
            padding: 6px 26px;
          }

          .renderedMarkdown ul li {
            list-style-type: disc;
          }

          .renderedMarkdown li ul {
            padding: 0px 26px;
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

          .locationSection {
            padding-top: 9px;
          }

          .locationSection h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #484848;
            padding-bottom: 6px;
          }

          .locationContainer {
            display: grid;
            grid-template-columns: auto 6fr;
            gap: 9px;
            align-items: center;
            justify-items: end;
          }

          .resourceName {
            font-weight: 600;
          }

          .serviceHours {
            padding-top: 6px;
          }

          .serviceHours table.compact tr th,
          .serviceHours table.compact tr td {
            padding-bottom: 2px;
            padding-top: 6px;
          }

          .serviceHours table tr th {
            font-weight: 600;
          }

          .hoursTitle {
            font-weight: 600;
            text-decoration: underline;
          }

          .serviceHandoutPdf .map {
            height: 300px;
          }

        `}
          </style>
          <header className="titleSection">
            <h1 className="serviceTitle">{service.name}</h1>
            <ServiceProgramDetails service={service} organization={resource} />
          </header>

          <ServiceListingSection title="About" className="aboutSection">
            <ReactMarkdown
              className="renderedMarkdown"
              source={service.long_description}
              linkTarget="_blank"
            />
            <ServiceAttribution
              attribution={resource.source_attribution}
              status={resource.status}
            />
          </ServiceListingSection>

          {details.length > 0 && (
            <ServiceListingSection className="detailsSection">
              <Datatable
                rowRenderer={(d) => (
                  <>
                    <tr key={d.title}>
                      <th>{d.title}</th>
                    </tr>
                    <tr>
                      <td>
                        <ReactMarkdown className="renderedMarkdown">
                          {d.value}
                        </ReactMarkdown>
                      </td>
                    </tr>
                  </>
                )}
                rows={details}
              />
            </ServiceListingSection>
          )}

          <ServiceListingSection className="contactInfo" title="Contact Info">
            <TableOfContactInfo service={service} />
          </ServiceListingSection>

          {locations.length > 0 && (
            <ServiceListingSection
              className="locationSection"
              title="Location and Hours"
            >
              <div className="locationContainer">
                <div className="addressInfo">
                  <ServiceAddress
                    address={locations[0].address}
                    resourceName={service.resource.name}
                  />

                  <div className="serviceHours">
                    <p className="hoursTitle">Hours</p>
                    <TableOfOpeningTimes
                      recurringSchedule={locations[0].recurringSchedule}
                    />
                  </div>
                </div>
                <div>
                  <img src={mapImgSrc ?? ""} alt="Map" />
                </div>
              </div>
            </ServiceListingSection>
          )}
        </div>
      )}
    </div>
  );
};

// These components have been (mostly) repurposed from the Service Listing Page
type ServiceListingSectionProps = {
  title?: string;
} & React.HTMLProps<HTMLDivElement>;

// A title with the content of a section
export const ServiceListingSection = ({
  children,
  title,
  ...props
}: ServiceListingSectionProps) => (
  <section {...props}>
    {{ title } && <h2>{title}</h2>}
    {children}
  </section>
);

type ServiceProgramDetailsProps = {
  service: Service;
  organization: Organization;
};

export const ServiceProgramDetails = ({
  service,
  organization,
}: ServiceProgramDetailsProps) => (
  <p className="subtitle">
    A service
    {service.program ? ` in the ${service.program.name} program` : null}
    {" offered by "}
    <span className="subtitle_orgName">{organization.name}</span>
  </p>
);

type ServiceAddressProps = {
  resourceName: string;
  address: Address;
};

const ServiceAddress = ({ resourceName, address }: ServiceAddressProps) => {
  const { address_1, address_2, city, state_province, postal_code } = address;
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
    </div>
  );
};
