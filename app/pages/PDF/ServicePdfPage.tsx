import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import {
  MapOfLocations,
  ServiceAttribution,
  TableOfContactInfo,
  TableOfOpeningTimes,
} from "components/listing";
import { Datatable, Loader } from "components/ui";
import {
  fetchService,
  generateServiceDetails,
  getServiceLocations,
  Organization,
  Service,
} from "../../models";
import {
  Address,
} from "../../models/Meta";

// import styles from "."module"scss";

export const ServicePdfPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [pdfSource, setPdfSource] = useState('');

  const details = useMemo(
    () => (service ? generateServiceDetails(service) : []),
    [service]
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    fetchService(id).then((s) => setService(s));
    if (loaded) {
      setTimeout(() => {
        fetch(`/api/services/html_to_pdf`, {
          body: JSON.stringify({html: ref.current?.outerHTML}),
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' }
        }).then(resp => resp.blob()).then(blob => {
          setPdfSource(window.URL.createObjectURL(blob));
        });
      }, 3000);


    }
  }, [id, loaded]);

  if (!service) {
    return <Loader />;
  }

  if (ref.current) {
    if (!loaded) {
      setLoaded(true);
    }
  }

  const { resource, recurringSchedule } = service;
  const locations = getServiceLocations(service, resource, recurringSchedule);

  return (
    <div>
    <embed
      src={pdfSource}
      type="application/pdf"
      height="100%"
      width="100%"
      style={{ height: '97vh', display: pdfSource ? 'block' : 'none', }}
    />
      <div ref={ref} className="serviceHandout serviceHandoutPdf">
        <style>{`

          * {
            margin: 0;
            font-family: "Open Sans", "San Francisco", "Roboto", "Arial", sans-serif;
          }
          .serviceHandoutPdf table.compact tr th,
          .serviceHandoutPdf table.compact tr td {
            padding-left: 0;
          }

          .serviceHandoutPdf table tr th {
            font-weight: bold;
            color: #666;
          }

          .serviceHandoutPdf table tr th, table tr td {
            padding: 10px;
            text-align: left;
          }

          .serviceHandoutPdf table tr td ul {
            list-style: none;
          }

          .serviceHandoutPdf table tr td li {
            padding: 0;
          }

          .serviceHandoutPdf .map {
            height: 300px;
          }

          .serviceHandout {
            padding: 30px;
            // position: absolute;
            // top: 0;
            // bottom: 0;
            // right: 0;
            // left: 0;
            // z-index: 9999999;
            // overflow: scroll;
            background-color: #fff;
          }

          .titleSection {
            display: grid;
            gap: 8px;
            border-bottom: solid 3px #31adb5;
            padding-bottom: 10px;
          }

          .serviceTitle {
            color: #31adb5;
            font-weight: 800;
            font-size: 24px;
          }

          .subtitle {
            font-style: italic;
          }

          .aboutSection {
            padding: 18px 0;
          }

          .aboutSection h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #484848;
            padding-bottom: 10px;
          }

          .contactInfo h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #ff6821;
          }

          .renderedMarkdown strong {
            font-weight: 600;
            color: #666;
          }

          .renderedMarkdown em {
            font-style: italic;
          }

          .renderedMarkdown ul {
            padding: 12px 26px;
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

          .renderedMarkdown h1 {
            font-size: 16px;
            font-family: "Open Sans", "San Francisco", "Roboto", "Arial", sans-serif;
          }

          .renderedMarkdown ol {
            padding: 12px 26px;
          }

          p strong {
            color: #242c2e;
          }

          .locationSection {
            padding-top: 18px;
          }

          .locationSection h2 {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 800;
            color: #484848;
            padding-bottom: 10px;
          }

          .locationContainer {
            display: grid;
            grid-template-columns: auto 6fr;
            gap: 25px;
          }

          .resourceName {
            font-weight: 600;
          }

          .serviceHours {
            padding-top: 10px;
          }

          .serviceHours table tr th {
            font-weight: 600;
          }

          .hoursTitle {
            font-weight: 600;
            padding-bottom: 8px;
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
          <ServiceListingSection title="">
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

        <ServiceListingSection
          className="contactInfo"
          title="Contact Info"
        >
          <TableOfContactInfo service={service} />
        </ServiceListingSection>

        {locations.length > 0 && (
          <ServiceListingSection
            className="locationSection"
            title="Location and Hours"
          >
            <div className="locationContainer">
              <div className="addressInfo">
                <ServiceAddress address={locations[0].address} resourceName={service.resource.name} />

                <div className="serviceHours">
                  <p className="hoursTitle">Hours</p>
                  <TableOfOpeningTimes
                    recurringSchedule={locations[0].recurringSchedule}
                  />
                </div>

              </div>
              <div>
                <MapOfLocations
                  locations={locations}
                  instanceMapOptions={{ disableDefaultUI: true }}
                />
              </div>
            </div>

          </ServiceListingSection>
        )}
      </div>
    </div>
  );
};

type ServiceListingSectionProps = {
  title: string;
} & React.HTMLProps<HTMLDivElement>;

// A title with the content of a section
export const ServiceListingSection = ({
  children,
  title,
  ...props
}: ServiceListingSectionProps) => (
  <section {...props}>
    <h2>{title}</h2>
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

const ServiceAddress = (
  {resourceName, address}: ServiceAddressProps
) => {
  const { address_1, address_2, city, state_province, postal_code } = address;
  return (
    <div>
      <p className="resourceName">{resourceName}</p>
      <p>
        <span>{address_1}</span>
        {address_2
          && (
          <span>
            <span> </span>
            <span>{address_2}</span>
          </span>
          )}
      </p>
      <p>
        <span>{city}</span>
        ,
        {' '}
        <span>{state_province}</span>
        {' '}
        <span>{postal_code}</span>
      </p>
    </div>
  );
};
