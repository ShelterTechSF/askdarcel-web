import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { DetailInfoSection } from "components/ui/Cards/DetailInfoSection";
import { removeAsterisksAndHashes } from "utils/strings";
import ListingPageHeader from "components/DetailPage/PageHeader";
import DetailPageWrapper from "components/DetailPage/DetailPageWrapper";
import {
  ActionBarMobile,
  AddressInfoRenderer,
  EmailRenderer,
  MapOfLocations,
  NotesList,
  PhoneNumberRenderer,
  ResourceCategories,
  ServiceCard,
  WebsiteRenderer,
} from "../components/DetailPage";
import PageNotFound from "components/ui/PageNotFound";
import { Loader } from "components/ui/Loader";
import {
  fetchOrganization,
  getDetailActions,
  getOrganizationLocations,
  Organization,
  DetailAction,
} from "../models";

// Page at /organization/123
export const OrganizationDetailPage = () => {
  const { organizationListingId } = useParams();
  const [org, setOrg] = useState<Organization | null>(null);

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrganizationWithErrorHandling = async () => {
      setIsLoading(true);
      try {
        const org = await fetchOrganization(organizationListingId as string);

        setOrg(org);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setOrg(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationWithErrorHandling();
  }, [organizationListingId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !org) {
    return (
      <DetailPageWrapper
        title={`Our415`}
        description=""
        sidebarActions={[]}
        onClickAction={() => "noop"}
      >
        <PageNotFound />
      </DetailPageWrapper>
    );
  }

  // When is org.status inactive?
  if (org.status === "inactive") {
    return (
      <DetailPageWrapper
        title={`Our415`}
        description=""
        sidebarActions={[]}
        onClickAction={() => "noop"}
      >
        <PageNotFound />
      </DetailPageWrapper>
    );
  }

  const orgLocations = getOrganizationLocations(org);
  const allActions = getDetailActions(org);
  const sidebarActions = allActions.filter((a) =>
    ["print", "phone", "directions"].includes(a.icon)
  );
  const mobileActions = allActions.filter((a) =>
    ["phone", "directions"].includes(a.icon)
  );
  const onClickAction = (action: DetailAction) => {
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
      title={org.name}
      description={org.long_description || ""}
      sidebarActions={sidebarActions}
      onClickAction={onClickAction}
    >
      <ListingPageHeader title={org.name} dataCy="org-page-title" />

      <ActionBarMobile actions={mobileActions} onClickAction={onClickAction} />

      <DetailInfoSection title="About" data-cy="org-about-section">
        <ReactMarkdown className="rendered-markdown">
          {org.long_description ||
            org.short_description ||
            "No Description available"}
        </ReactMarkdown>
      </DetailInfoSection>

      <DetailInfoSection title="Services" data-cy="org-services-section">
        {org.services.length > 0 &&
          org.services.map((srv) => (
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

      <DetailInfoSection title="Contact" data-cy="org-info-section">
        <ResourceCategories categories={org.categories} />
        {(org.addresses || []).map((address) => (
          <AddressInfoRenderer address={address} key={address.id} />
        ))}
        {org.phones.length > 0 && <PhoneNumberRenderer phones={org.phones} />}
        {org.website && <WebsiteRenderer website={org.website} />}
        {org.email && <EmailRenderer email={org.email} />}
      </DetailInfoSection>

      {orgLocations?.length > 0 && (
        <DetailInfoSection title="Location" borderBottom={org.notes.length > 0}>
          <MapOfLocations locations={orgLocations} />
        </DetailInfoSection>
      )}

      {org.notes.length > 0 && (
        <DetailInfoSection title="Notes" borderBottom={false}>
          <NotesList notes={org.notes} />
        </DetailInfoSection>
      )}
    </DetailPageWrapper>
  );
};
