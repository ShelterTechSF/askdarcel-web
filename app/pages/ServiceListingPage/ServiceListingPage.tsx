import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { useParams, Redirect, useLocation } from "react-router-dom";
import qs from "qs";
import {
  ActionBarMobile,
  ActionSidebar,
  MapOfLocations,
  MOHCDBadge,
  ServiceAttribution,
  ServiceCard,
  TableOfContactInfo,
  TableOfOpeningTimes,
} from "components/listing";
import { Datatable, Footer, Loader } from "components/ui";
import { removeAsterisksAndHashes } from "utils/strings";
import whiteLabel from "../../utils/whitelabel";
import {
  fetchService,
  generateServiceDetails,
  getOrganizationActions,
  getServiceLocations,
  Organization,
  OrganizationAction,
  Service,
} from "../../models";
import styles from "./ServiceListingPage.module.scss";

const { title: whiteLabelTitle, footerOptions: whiteLabelFooterOpts } =
  whiteLabel;

// Page at /services/123
export const ServiceListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const details = useMemo(
    () => (service ? generateServiceDetails(service) : []),
    [service]
  );
  const { search } = useLocation();
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);
  const { visitDeactivated } = searchState;

  useEffect(() => {
    fetchService(id).then((s) => setService(s));
    // TODO Handle Errors
  }, [id]);

  if (!service) {
    return <Loader />;
  }
  if (service.status === "inactive" && !visitDeactivated) {
    return <Redirect to="/" />;
  }

  const { resource, recurringSchedule } = service;
  const formattedLongDescription = removeAsterisksAndHashes(
    service.long_description
  );
  const locations = getServiceLocations(service, resource, recurringSchedule);
  const allActions = getOrganizationActions(resource);
  const sidebarActions = allActions.filter((a) =>
    ["print", "phone", "directions"].includes(a.icon)
  );
  const mobileActions = allActions.filter((a) =>
    ["phone", "directions"].includes(a.icon)
  );
  const onClickAction = (action: OrganizationAction) => {
    switch (action.icon) {
      case "print":
        window.print();
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles[`listing-container`]}>
      <Helmet>
        <title>{`${service.name} | ${whiteLabelTitle}`}</title>
        <meta name="description" content={formattedLongDescription} />
      </Helmet>
      <article className={styles.listing} id="service">
        <div
          className={`${styles["listing--main"]} ${styles["weglot-dynamic"]}`}
        >
          <div className={styles["listing--main--left"]}>
            <header>
              <div className={styles["org--main--header--title-container"]}>
                <h1 data-cy="service-page-title">{service.name}</h1>
                <MOHCDBadge resource={resource} />
              </div>
              <ServiceProgramDetails
                service={service}
                organization={resource}
              />
            </header>

            <span className="no-print">
              <ActionBarMobile
                actions={mobileActions}
                onClickAction={onClickAction}
              />
            </span>

            <ServiceListingSection
              title="About"
              data-cy="service-about-section"
            >
              <ReactMarkdown
                className="rendered-markdown"
                source={formattedLongDescription}
                linkTarget="_blank"
              />
              <ServiceAttribution
                attribution={resource.source_attribution}
                status={resource.status}
              />
            </ServiceListingSection>

            {details.length > 0 && (
              <ServiceListingSection
                title="Details"
                data-cy="service-details-section"
              >
                <Datatable
                  rowRenderer={(detail) => (
                    <tr key={detail.title}>
                      <th>{detail.title}</th>
                      <td>
                        <ReactMarkdown className="rendered-markdown">
                          {detail.value}
                        </ReactMarkdown>
                      </td>
                    </tr>
                  )}
                  rows={details}
                />
              </ServiceListingSection>
            )}

            <ServiceListingSection
              title="Contact"
              data-cy="service-contact-section"
            >
              <TableOfContactInfo service={service} />
            </ServiceListingSection>

            {locations.length > 0 && (
              <ServiceListingSection
                title="Location and hours"
                data-cy="service-loc-hours-section"
              >
                <div className={styles["service-loc-hours-section"]}>
                  <MapOfLocations
                    locations={locations}
                    locationRenderer={(location: any) => (
                      <TableOfOpeningTimes
                        recurringSchedule={location.recurringSchedule}
                      />
                    )}
                  />
                </div>
              </ServiceListingSection>
            )}

            {resource.services.length > 1 && (
              <ServiceListingSection
                title="Other services at this organization"
                data-cy="service-other-section"
              >
                {resource.services
                  .filter((srv) => srv.id !== service.id)
                  .map((srv) => (
                    <ServiceCard service={srv} key={srv.id} />
                  ))}
              </ServiceListingSection>
            )}
          </div>
          <aside className={`${styles["listing--aside"]} no-print`}>
            <ActionSidebar
              actions={sidebarActions}
              onClickAction={onClickAction}
            />
          </aside>
        </div>
      </article>
      {whiteLabelFooterOpts.showOnListingPages && <Footer />}
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

// Details if the service is part of a larger program, and the organization that provides it
export const ServiceProgramDetails = ({
  service,
  organization,
}: ServiceProgramDetailsProps) => (
  <span className={styles["service--program--details"]}>
    A service
    {service.program ? ` in the ${service.program.name} program` : null}
    {" offered by "}
    <a href={`/organizations/${organization.id}`}>{organization.name}</a>
  </span>
);
