import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { useParams, Redirect, useLocation } from "react-router-dom";
import qs from "qs";
import {
  ActionBarMobile,
  ActionSidebar,
  FeedbackModal,
  ListingTitleLink,
  MapOfLocations,
  MOHCDBadge,
  ServiceAttribution,
  ServiceCard,
  TableOfContactInfo,
  TableOfOpeningTimes,
} from "components/listing";
import { Datatable, Loader } from "components/ui";
import whiteLabel from "../utils/whitelabel";
import {
  fetchService,
  generateServiceDetails,
  getOrganizationActions,
  getServiceLocations,
  Organization,
  OrganizationAction,
  Service,
} from "../models";

const { title: whiteLabelTitle } = whiteLabel;

// Page at /services/123
export const ServiceListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
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
  const locations = getServiceLocations(service, resource, recurringSchedule);
  const allActions = getOrganizationActions(resource);
  const sidebarActions = allActions.filter((a) =>
    ["print", "directions", "feedback"].includes(a.icon)
  );
  const mobileActions = allActions.filter((a) =>
    ["phone", "directions", "feedback"].includes(a.icon)
  );
  const onClickAction = (action: OrganizationAction) => {
    switch (action.icon) {
      case "feedback":
        setFeedbackModalOpen(true);
        break;
      case "print":
        window.print();
        break;
      default:
        break;
    }
  };

  return (
    <div className="listing-container">
      <Helmet>
        <title>{`${service.name} | ${whiteLabelTitle}`}</title>
        <meta name="description" content={service.long_description} />
      </Helmet>
      <article className="listing" id="service">
        <div className="listing--main">
          <div className="listing--main--left">
            <header>
              <div className="org--main--header--title-container">
                <h1 data-cy="service-page-title">{service.name}</h1>
                <MOHCDBadge resource={resource} />
              </div>
              {/* {service.alsoNamed ? <p>Also Known As</p> : null} */}
              <ServiceProgramDetails
                service={service}
                organization={resource}
              />
            </header>

            <ActionBarMobile
              actions={mobileActions}
              onClickAction={onClickAction}
            />

            <ServiceListingSection
              title="About This Service"
              data-cy="service-about-section"
            >
              <ReactMarkdown
                className="rendered-markdown"
                source={service.long_description}
                linkTarget="_blank"
              />
              <ServiceAttribution
                attribution={resource.source_attribution}
                status={resource.status}
              />
            </ServiceListingSection>

            {details.length > 0 && (
              <ServiceListingSection
                title="Service Details"
                data-cy="service-details-section"
              >
                <Datatable
                  rowRenderer={(d) => (
                    <tr key={d.title}>
                      <th>{d.title}</th>
                      <td>
                        <ReactMarkdown className="rendered-markdown">
                          {d.value}
                        </ReactMarkdown>
                      </td>
                    </tr>
                  )}
                  rows={details}
                />
              </ServiceListingSection>
            )}

            <ServiceListingSection
              title="Contact Info"
              data-cy="service-contact-section"
            >
              <TableOfContactInfo service={service} />
            </ServiceListingSection>

            {locations.length > 0 && (
              <ServiceListingSection
                title="Location and Hours"
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
                {/* TODO Transport Options */}
              </ServiceListingSection>
            )}

            {resource.services.length > 0 && (
              <ServiceListingSection
                title="Other Services at this Location"
                data-cy="service-other-section"
              >
                {resource.services
                  .filter((srv) => srv.id !== service.id)
                  .map((srv) => (
                    <ServiceCard service={srv} key={srv.id} />
                  ))}
              </ServiceListingSection>
            )}

            {/* TODO Need an API to get similar services, maybe same category for now? */}
            {/* <section>
                <h2>Similar Services Near You</h2>
              </section>
            */}

            <FeedbackModal
              isOpen={feedbackModalOpen}
              setIsOpen={setFeedbackModalOpen}
              service={service}
              organization={resource}
            />
          </div>
          <div className="listing--aside">
            <ActionSidebar
              actions={sidebarActions}
              onClickAction={onClickAction}
            />
          </div>
        </div>
      </article>
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

// TODO Implement rendering/popover when programs exist
// Details if the service is part of a larger program, and the organization that provides it
export const ServiceProgramDetails = ({
  service,
  organization,
}: ServiceProgramDetailsProps) => (
  <span className="service--program--details">
    A service
    {service.program ? ` in the ${service.program.name} program` : null}
    {" offered by "}
    <ListingTitleLink type="org" listing={organization} />
  </span>
);
