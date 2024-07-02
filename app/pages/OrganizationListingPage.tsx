import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Redirect, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import qs from "qs";
import { ListingInfoSection } from "components/ui/Cards/ListingInfoSection";
import { removeAsterisksAndHashes } from "utils/strings";
import {
  ActionBarMobile,
  ActionSidebar,
  AddressInfoRenderer,
  EmailRenderer,
  MapOfLocations,
  MOHCDBadge,
  // Notes,
  PhoneNumberRenderer,
  // RelativeOpeningTime,
  ResourceCategories,
  ServiceCard,
  TableOfOpeningTimes,
  WebsiteRenderer,
} from "../components/listing";
import { Footer, Loader } from "../components/ui";
import whitelabel from "../utils/whitelabel";
import {
  fetchOrganization,
  getOrganizationActions,
  getOrganizationLocations,
  Organization,
  OrganizationAction,
} from "../models";

// Page at /organization/123
export const OrganizationListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const { search } = useLocation();
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);
  const { visitDeactivated } = searchState;

  useEffect(() => {
    fetchOrganization(id).then((o) => setOrg(o));
    // TODO Handle Errors
  }, [id]);

  if (!org) {
    return <Loader />;
  }
  if (org.status === "inactive" && !visitDeactivated) {
    return <Redirect to="/" />;
  }

  const orgLocations = getOrganizationLocations(org);
  const allActions = getOrganizationActions(org);
  const sidebarActions = allActions.filter((a) =>
    ["print", "directions"].includes(a.icon)
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
    <div className="org-container">
      <Helmet>
        <title>{`${org.name} | ${whitelabel.title}`}</title>
        <meta name="description" content={org.long_description || ""} />
      </Helmet>
      <article className="org" id="resource">
        <div className="org--main weglot-dynamic">
          <div className="org--main--left">
            <header className="org--main--header">
              <div className="org--main--header--title-container">
                <h1
                  data-cy="org-page-title"
                  className="org--main--header--title notranslate"
                >
                  {org.name}
                </h1>
                <MOHCDBadge resource={org} />
              </div>
            </header>

            <ActionBarMobile
              actions={mobileActions}
              onClickAction={onClickAction}
            />

            <ListingInfoSection title="About" data-cy="org-about-section">
              <ReactMarkdown
                className="rendered-markdown"
                source={
                  org.long_description ||
                  org.short_description ||
                  "No Description available"
                }
              />
            </ListingInfoSection>

            <ListingInfoSection title="Services" data-cy="org-services-section">
              {org.services.length > 0 &&
                org.services.map((srv) => (
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

            {/* <Notes notes={org.notes} id="notes" /> */}

            <ListingInfoSection title="Contact" data-cy="org-info-section">
              <ul className="info">
                <div className="info--column">
                  <ResourceCategories categories={org.categories} />
                  {(org.addresses || []).map((address) => (
                    <AddressInfoRenderer address={address} key={address.id} />
                  ))}
                  {org.phones.length > 0 && (
                    <PhoneNumberRenderer phones={org.phones} />
                  )}
                  {org.website && <WebsiteRenderer website={org.website} />}
                  {org.email && <EmailRenderer email={org.email} />}
                </div>
              </ul>
            </ListingInfoSection>

            {orgLocations?.length > 0 && (
              <ListingInfoSection title="Location" borderBottom={false}>
                <MapOfLocations
                  locations={orgLocations}
                  locationRenderer={(loc: any) => (
                    <TableOfOpeningTimes
                      recurringSchedule={loc.recurringSchedule}
                    />
                  )}
                />
              </ListingInfoSection>
            )}
          </div>

          <aside className="org--aside">
            <ActionSidebar
              actions={sidebarActions}
              onClickAction={onClickAction}
            />
          </aside>
        </div>
      </article>
      {whitelabel.footerOptions.showOnListingPages && <Footer />}
    </div>
  );
};
