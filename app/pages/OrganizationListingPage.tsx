import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ActionSidebar,
  ActionSidebarMobile,
  AddressInfoRenderer,
  EmailRenderer,
  MapOfLocations,
  MOHCDBadge,
  Notes,
  PhoneNumberRenderer,
  RelativeOpeningTime,
  ResourceCategories,
  ServiceList,
  TableOfOpeningTimes,
  WebsiteRenderer,
} from '../components/listing';
import { Loader } from '../components/ui';
import whitelabel from '../utils/whitelabel';
import { fetchOrganization, getResourceLocations, Organization } from '../models';

// Page at /organization/123
export const OrganizationListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization|null>(null);

  useEffect(() => {
    fetchOrganization(id)
      .then(o => setOrg(o));
    // TODO Handle Errors
  }, [id]);

  if (!org) { return <Loader />; }

  const orgLocations = getResourceLocations(org);

  return (
    <div className="org-container">
      <Helmet>
        <title>
          {`${org.name} | ${whitelabel.title}`}
        </title>
        <meta name="description" content={org.long_description || ''} />
      </Helmet>
      <article className="org" id="resource">
        <div className="org--main">
          <div className="org--main--left">
            <header className="org--main--header">
              <div className="org--main--header--title-container">
                <h1 data-cy="org-page-title" className="org--main--header--title">{org.name}</h1>
                <MOHCDBadge resource={org} />
              </div>
              <div className="org--main--header--hours">
                <RelativeOpeningTime recurringSchedule={org.recurringSchedule} />
              </div>
              { org.phones.length > 0
                && (
                  <div className="org--main--header--phone">
                    <PhoneNumberRenderer phones={org.phones} />
                  </div>
                )
              }
            </header>

            <ActionSidebarMobile organization={org} />

            <OrganizationListingSection title="About This Organization" className="org--main--header--description" data-cy="org-about-section">
              <ReactMarkdown className="rendered-markdown" source={org.long_description || org.short_description || 'No Description available'} />
            </OrganizationListingSection>

            <OrganizationSubheaderSection title="Services" className="service--section" data-cy="org-services-section">
              <ServiceList services={org.services} />
            </OrganizationSubheaderSection>

            <Notes notes={org.notes} id="notes" />

            <OrganizationSubheaderSection title="Info" className="info--section" data-cy="org-info-section">
              <ul className="info">
                <div className="info--column">
                  <ResourceCategories categories={org.categories} />
                  {(org.addresses || []).map(address => (
                    <AddressInfoRenderer address={address} key={address.id} />
                  ))}
                  {org.phones.length > 0 && <PhoneNumberRenderer phones={org.phones} />}
                  {org.website && <WebsiteRenderer website={org.website} />}
                  {org.email && <EmailRenderer email={org.email} />}
                </div>
              </ul>
            </OrganizationSubheaderSection>

            {orgLocations?.length > 0 && (
            <OrganizationSubheaderSection title="Location" className="location--section">
              <MapOfLocations
                locations={orgLocations}
                locationRenderer={(loc: any) => (
                  <TableOfOpeningTimes recurringSchedule={loc.recurringSchedule} />
                )}
              />
            </OrganizationSubheaderSection>
            )}

          </div>

          <div className="org--aside">
            <ActionSidebar organization={org} />
          </div>
        </div>
      </article>
    </div>
  );
};

type OrganizationListingSectionProps = {
  title: string;
} & React.HTMLProps<HTMLDivElement>

// A title with the content of a section
export const OrganizationListingSection = ({
  children, title, ...props
}: OrganizationListingSectionProps) => (
  <section {...props}>
    <h2>{title}</h2>
    {children}
  </section>
);

// A subtitle with the content of a section
export const OrganizationSubheaderSection = ({
  children, title, ...props
}: OrganizationListingSectionProps) => (
  <section {...props}>
    <header className="service--section--header">
      <h4>{title}</h4>
    </header>
    {children}
  </section>
);
