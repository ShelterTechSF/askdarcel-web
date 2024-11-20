import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useLocation } from "react-router-dom";
import qs from "qs";
import {
  ActionBarMobile,
  MapOfLocations,
  ServiceCard,
  ContactInfoTableRows,
} from "components/DetailPage";
import { InfoTable } from "components/DetailPage/InfoTable";
import { Loader } from "components/ui/Loader";
import { removeAsterisksAndHashes } from "utils/strings";
import { DetailInfoSection } from "components/ui/Cards/DetailInfoSection";
import ListingPageHeader from "components/DetailPage/PageHeader";
import DetailPageWrapper from "components/DetailPage/DetailPageWrapper";
import LabelTagRows from "components/DetailPage/LabelTagRows";
import {
  fetchService,
  FetchServiceError,
  generateServiceDetails,
  getOrganizationActions,
  getServiceLocations,
  Organization,
  OrganizationAction,
  Service,
} from "../../models";
import styles from "./ServiceDetailPage.module.scss";
import { searchClient } from "@algolia/client-search";
import config from "../../config";
import PageNotFound from "components/ui/PageNotFound";

const client = searchClient(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);

const INDEX_NAME = `${config.ALGOLIA_INDEX_PREFIX}_services_search`;

// NOTE: `serviceFallback` and `setServiceFallback` is a hack to fetch data from
// Algolia rather than the Shelter Tech API. It's nott known why some data is
// not in sync between ST's API and their Algolia instance.
//
// DECISION: Manage the fetched service or fallback service result separately.
// There may be a better way to write the JSX or conditional logic below. Let's
// tackle that post MVP.
//
// As a workaround we've decided to implement a partial view of the Service
// information with a warning to verify the validity of the information
// themselves.
export const ServiceDetailPage = () => {
  const { serviceListingId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [serviceFallback, setServiceFallback] = useState<Service | null>(null);
  const [error, setError] = useState<FetchServiceError>();
  const details = useMemo(
    () => (service ? generateServiceDetails(service) : []),
    [service]
  );

  const { search, pathname } = useLocation();
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);
  const { visitDeactivated } = searchState;

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const fetchServiceOrFallback = async () => {
      try {
        const response = await fetchService(serviceListingId as string);

        // We need to check the contents of the response since `fetchService`
        // does not throw. TODO: reconsider this design because processing a
        // thrown error requires less knowledge of the response type.
        if ("message" in response) {
          try {
            // CAVEAT: Hopefully this does not change!
            const serviceObjectID = `service_${pathname.split("/")[2]}`;
            const service = (await client.getObject({
              indexName: INDEX_NAME,
              objectID: serviceObjectID,
            })) as unknown as Service;

            setServiceFallback(service);
            setService(null);
          } catch (error) {
            setService(null);
            setError(response);
          }
        } else {
          setService(response);
        }
      } catch (error) {
        setError(error as FetchServiceError);
      }
    };

    fetchServiceOrFallback();
  }, [serviceListingId, pathname]);

  if (serviceFallback) {
    const formattedLongDescription = serviceFallback.long_description
      ? removeAsterisksAndHashes(serviceFallback.long_description)
      : undefined;
    return (
      <DetailPageWrapper
        title={`Our415 - ${serviceFallback.name}`}
        description=""
        sidebarActions={[]}
        onClickAction={() => "noop"}
      >
        <ListingPageHeader
          title={serviceFallback.name}
          dataCy="service-page-title"
        >
          <div
            style={{
              background: "LightYellow",
              padding: "1em",
            }}
          >
            <strong>
              {" "}
              ℹ️ The information on this page is incomplete. Please contact the
              service provider below to confirm the provider is still active.{" "}
            </strong>
          </div>
        </ListingPageHeader>

        <DetailInfoSection title="About" data-cy="service-about-section">
          <ReactMarkdown className="rendered-markdown" linkTarget="_blank">
            {formattedLongDescription || ""}
          </ReactMarkdown>
        </DetailInfoSection>
        <DetailInfoSection title="Contact" data-cy="service-contact-section">
          <InfoTable
            rows={[serviceFallback]}
            rowRenderer={(srv) => (
              <ContactInfoTableRows key={srv.id} service={srv} />
            )}
          />
        </DetailInfoSection>
      </DetailPageWrapper>
    );
  }

  if (error) {
    return (
      <DetailPageWrapper
        title="Our415 - Page Error"
        description=""
        sidebarActions={[]}
        onClickAction={() => "noop"}
      >
        <PageNotFound />
      </DetailPageWrapper>
    );
  }

  if (!service) {
    return <Loader />;
  }
  if (service.status === "inactive" && !visitDeactivated) {
    return <PageNotFound />;
  }

  const { resource, recurringSchedule } = service;

  // Returning `undefined` instead of `null` since consuming code prefers this
  const formattedLongDescription = service.long_description
    ? removeAsterisksAndHashes(service.long_description)
    : undefined;
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
    <DetailPageWrapper
      title={`Our415 - ${service.name}`}
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

      <DetailInfoSection title="About" data-cy="service-about-section">
        <ReactMarkdown className="rendered-markdown" linkTarget="_blank">
          {formattedLongDescription || ""}
        </ReactMarkdown>
      </DetailInfoSection>

      {details.length > 0 && (
        <DetailInfoSection title="Details" data-cy="service-details-section">
          <InfoTable<{ title: string; value: string }>
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
        </DetailInfoSection>
      )}

      <DetailInfoSection title="Contact" data-cy="service-contact-section">
        <InfoTable
          rows={[service]}
          rowRenderer={(srv) => (
            <ContactInfoTableRows key={srv.id} service={srv} />
          )}
        />
      </DetailInfoSection>

      {locations.length > 0 && (
        <DetailInfoSection
          title="Location and hours"
          data-cy="service-loc-hours-section"
        >
          <MapOfLocations locations={locations} />
        </DetailInfoSection>
      )}

      {resource.services.length > 1 && (
        <DetailInfoSection
          title="Other services at this organization"
          data-cy="service-other-section"
        >
          {resource.services
            .filter((srv) => srv.id !== service.id)
            .map((srv) => (
              <ServiceCard
                service={{
                  ...srv,
                  long_description: srv.long_description
                    ? removeAsterisksAndHashes(srv.long_description)
                    : null,
                }}
                key={srv.id}
              />
            ))}
        </DetailInfoSection>
      )}
      {(service.categories.length > 0 || service.eligibilities.length > 0) && (
        <DetailInfoSection
          title="Tags"
          borderBottom={false}
          data-cy="service-tags-section"
        >
          <InfoTable>
            <LabelTagRows
              categories={service.categories}
              eligibilities={service.eligibilities}
            />
          </InfoTable>
        </DetailInfoSection>
      )}
    </DetailPageWrapper>
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
