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

import styles from "./styles.module.scss";

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
    // window.addEventListener('load', handleLoad);
    if (loaded) {
      fetch(`/api/services/convert_to_pdf?url=http://dcnav.sfserviceguide.org/services/${id}`, {
        body: JSON.stringify({html: ref.current?.outerHTML}),
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      }).then(resp => resp.blob()).then(blob => {
        // setPdfSource(window.URL.createObjectURL(blob));
      });
      console.log(ref.current?.outerHTML);
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
    {/* <embed
      src={pdfSource}
      type="application/pdf"
      height="100%"
      width="100%"
      style={{ height: '95vh' }}
    /> */}
      <div ref={ref} className={`${styles.serviceHandout} serviceHandoutPdf`}>
        <style>{`
          .serviceHandoutPdf {
            background: blue;
          }

          :global {
            .serviceHandoutPdf table.compact tr th,
            .serviceHandoutPdf table.compact tr td {
              padding-left: 0;
            }

            .serviceHandoutPdf .map {
              height: 300px;
            }
          }

          .serviceHandout {
            padding: 44px 32px;
            // visibility: hidden;
          }

          .titleSection {
            display: grid;
            gap: 8px;
            border-bottom: solid 3px $handoutTeal;
            padding-bottom: 10px;
          }

          .serviceTitle {
            color: $handoutTeal;
            font-weight: 800;
            font-size: 24px;
          }

          .subtitle {
            font-style: italic;
          }

          .aboutSection {
            padding: 18px 0;
            h2 {
              text-transform: uppercase;
              font-size: 18px;
              font-weight: 800;
              color: $color-grey7;
              padding-bottom: 10px;
            }
          }

          .contactInfo {
            h2 {
              text-transform: uppercase;
              font-size: 18px;
              font-weight: 800;
              color: #ff6821;
            }
          }

          .renderedMarkdown {
            strong {
              font-weight: 600;
              color: $color-grey6;
            }

            em {
              font-style: italic;
            }

            ul {
              padding: 12px 26px;
              li {
                list-style-type: disc;
              }
            }

            li ul {
              padding: 0px 26px;
            }

            ol {
              padding: 12px 26px;
              li {
                list-style-type: decimal;
              }
            }

            p strong {
              color: $color-grey9;
            }
          }

          .locationSection {
            padding-top: 18px;
            h2 {
              text-transform: uppercase;
              font-size: 18px;
              font-weight: 800;
              color: $color-grey7;
              padding-bottom: 10px;
            }
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
            :global {
              table tr th {
                font-weight: 600;
              }
            }
          }

          .hoursTitle {
            font-weight: 600;
            padding-bottom: 8px;
          }

        `}
        </style>
        <header className={styles.titleSection}>
          <h1 className={styles.serviceTitle}>{service.name}</h1>
          <ServiceProgramDetails service={service} organization={resource} />
        </header>

        <ServiceListingSection title="About" className={styles.aboutSection}>
          <ReactMarkdown
            className={styles.renderedMarkdown}
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
                      <ReactMarkdown className={styles.renderedMarkdown}>
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
          className={styles.contactInfo}
          title="Contact Info"
        >
          <TableOfContactInfo service={service} />
        </ServiceListingSection>

        {locations.length > 0 && (
          <ServiceListingSection
            className={styles.locationSection}
            title="Location and Hours"
          >
            <div className={styles.locationContainer}>
              <div className={styles.addressInfo}>
                <ServiceAddress address={locations[0].address} resourceName={service.resource.name} />

                <div className={styles.serviceHours}>
                  <p className={styles.hoursTitle}>Hours</p>
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
  <p className={styles.subtitle}>
    A service
    {service.program ? ` in the ${service.program.name} program` : null}
    {" offered by "}
    <span className={styles.subtitle_orgName}>{organization.name}</span>
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
      <p className={styles.resourceName}>{resourceName}</p>
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
