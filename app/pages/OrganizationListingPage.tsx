import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Redirect, useLocation } from "react-router-dom";
import qs from "qs";
import { ListingInfoSection } from "components/ui/Cards/ListingInfoSection";
import { removeAsterisksAndHashes } from "utils/strings";
import ListingPageHeader from "components/listing/PageHeader";
import ListingPageWrapper from "components/listing/PageWrapper";
import {
  ActionBarMobile,
  AddressInfoRenderer,
  EmailRenderer,
  MapOfLocations,
  NotesList,
  PhoneNumberRenderer,
  ResourceCategories,
  ServiceCard,
  TableOfOpeningTimes,
  WebsiteRenderer,
} from "../components/listing";
import { Loader } from "../components/ui";

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
    <ListingPageWrapper
      title={org.name}
      description={org.long_description || ""}
      sidebarActions={sidebarActions}
      onClickAction={onClickAction}
    >
      <ListingPageHeader title={org.name} dataCy="org-page-title" />

      <ActionBarMobile actions={mobileActions} onClickAction={onClickAction} />

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

      <ListingInfoSection title="Contact" data-cy="org-info-section">
        <ResourceCategories categories={org.categories} />
        {(org.addresses || []).map((address) => (
          <AddressInfoRenderer address={address} key={address.id} />
        ))}
        {org.phones.length > 0 && <PhoneNumberRenderer phones={org.phones} />}
        {org.website && <WebsiteRenderer website={org.website} />}
        {org.email && <EmailRenderer email={org.email} />}
      </ListingInfoSection>

      {orgLocations?.length > 0 && (
        <ListingInfoSection
          title="Location"
          borderBottom={org.notes.length > 0}
        >
          <MapOfLocations
            locations={orgLocations}
            locationRenderer={(loc: any) => (
              <TableOfOpeningTimes recurringSchedule={loc.recurringSchedule} />
            )}
          />
        </ListingInfoSection>
      )}

      {org.notes.length > 0 && (
        <ListingInfoSection title="Notes" borderBottom={false}>
          <NotesList notes={org.notes} />
        </ListingInfoSection>
      )}
    </ListingPageWrapper>
  );
};
