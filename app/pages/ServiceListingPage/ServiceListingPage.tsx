import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Redirect, useLocation } from "react-router-dom";
import qs from "qs";
import {
  ActionBarMobile,
  MapOfLocations,
  ServiceAttribution,
  ServiceCard,
  TableOfOpeningTimes,
  ContactInfoTableRows,
} from "components/listing";
import { ListingInfoTable, Loader } from "components/ui";
import { removeAsterisksAndHashes } from "utils/strings";
import { ListingInfoSection } from "components/ui/Cards/ListingInfoSection";
import ListingPageHeader from "components/listing/PageHeader";
import ListingPageWrapper from "components/listing/PageWrapper";
import LabelTagRows from "components/listing/LabelTagRows";
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
    <ListingPageWrapper
      title={service.name}
      description={service.long_description || ""}
      sidebarActions={sidebarActions}
      onClickAction={onClickAction}
    >
      <ListingPageHeader title={service.name} dataCy="service-page-title">
        <ServiceProgramDetails service={service} organization={resource} />
      </ListingPageHeader>

      <span className="no-print">
        <ActionBarMobile
          actions={mobileActions}
          onClickAction={onClickAction}
        />
      </span>

      <ListingInfoSection title="About" data-cy="service-about-section">
        <ReactMarkdown
          className="rendered-markdown"
          source={formattedLongDescription}
          linkTarget="_blank"
        />
        <ServiceAttribution
          attribution={resource.source_attribution}
          status={resource.status}
        />
      </ListingInfoSection>

      {details.length > 0 && (
        <ListingInfoSection title="Details" data-cy="service-details-section">
          <ListingInfoTable
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
        </ListingInfoSection>
      )}

      <ListingInfoSection title="Contact" data-cy="service-contact-section">
        <ListingInfoTable
          rows={[service]}
          rowRenderer={(srv) => <ContactInfoTableRows service={srv} />}
        />
      </ListingInfoSection>

      {locations.length > 0 && (
        <ListingInfoSection
          title="Location and hours"
          data-cy="service-loc-hours-section"
        >
          <MapOfLocations
            locations={locations}
            locationRenderer={(location: any) => (
              <TableOfOpeningTimes
                recurringSchedule={location.recurringSchedule}
              />
            )}
          />
        </ListingInfoSection>
      )}

      {resource.services.length > 1 && (
        <ListingInfoSection
          title="Other services at this organization"
          data-cy="service-other-section"
        >
          {resource.services
            .filter((srv) => srv.id !== service.id)
            .map((srv) => (
              <ServiceCard
                service={{
                  ...srv,
                  long_description: removeAsterisksAndHashes(
                    srv.long_description
                  ),
                }}
                key={srv.id}
              />
            ))}
        </ListingInfoSection>
      )}
      {(service.categories.length > 0 || service.eligibilities.length > 0) && (
        <ListingInfoSection
          title="Tags"
          borderBottom={false}
          data-cy="service-tags-section"
        >
          <ListingInfoTable>
            <LabelTagRows service={service} />
          </ListingInfoTable>
        </ListingInfoSection>
      )}
    </ListingPageWrapper>
  );
};

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
