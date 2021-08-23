import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  AddressInfo,
  PhoneNumber,
  ResourceCategories,
  Website,
  Email,
  ActionSidebar,
  MobileActionBar,
  MOHCDBadge,
  RelativeOpeningTime,
  Notes,
  Services,
  TableOfOpeningTimes,
} from 'components/listing';
import { MapOfLocations } from 'components/maps';
import { Loader } from 'components/ui';
import { getSiteTitle } from '../utils/whitelabel';
import { fetchOrganization, getResourceLocations, Organization } from '../models';

// Page at /organization/123
export const OrganizationListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetchOrganization(id as any)
      .then(o => setOrg(o));
    // TODO Handle Errors
  }, [id]);

  if (!org || !(window as any).google) { return <Loader />; }

  const orgLocations = getResourceLocations(org);

  return (
    <div className="org-container">
      <Helmet>
        <title>
          {`${org.name} | ${getSiteTitle()}`}
        </title>
        <meta name="description" content={org.long_description || ''} />
      </Helmet>
      <article className="org" id="resource">
        <div className="org--main">
          <div className="org--main--left">
            <header className="org--main--header">
              <div className="org--main--header--title-container">
                <h1 className="org--main--header--title">{org.name}</h1>
                <MOHCDBadge resource={org} />
              </div>
              <div className="org--main--header--hours">
                <RelativeOpeningTime recurringSchedule={org.recurringSchedule} />
              </div>
              { org.phones.length > 0
                && (
                  <div className="org--main--header--phone">
                    <PhoneNumber phones={org.phones} />
                  </div>
                )
              }
            </header>

            <MobileActionBar resource={org} />

            <OrganizationListingSection title="About This Organization" className="org--main--header--description">
              <ReactMarkdown className="rendered-markdown" source={org.long_description || org.short_description || 'No Description available'} />
            </OrganizationListingSection>

            <OrganizationSubheaderSection title="Services" className="service--section">
              <Services services={org.services} />
            </OrganizationSubheaderSection>

            <Notes notes={org.notes} id="notes" />

            <OrganizationSubheaderSection title="Info" className="info--section">
              <ul className="info">
                <div className="info--column">
                  <ResourceCategories categories={org.categories} />
                  {(org.addresses || []).map(address => (
                    <AddressInfo address={address} key={address.id} />
                  ))}
                  {org.phones.length > 0 && <PhoneNumber phones={org.phones} />}
                  {org.website && <Website website={org.website} />}
                  {org.email && <Email email={org.email} />}
                </div>
              </ul>
            </OrganizationSubheaderSection>

            <OrganizationSubheaderSection title="Location" className="location--section">
              <MapOfLocations
                locations={orgLocations}
                locationRenderer={(location: any) => (
                  <TableOfOpeningTimes
                    recurringSchedule={location.recurringSchedule}
                  />
                )}
              />
            </OrganizationSubheaderSection>
          </div>

          <div className="org--aside">
            <ActionSidebar resource={org} />
          </div>
        </div>
      </article>
    </div>
  );
};

// A title with the content of a section
export const OrganizationListingSection = ({ children, title, className }: {
  children: React.ReactNode
  title: string
  className: string
}) => (
  <section className={className}>
    <h2>{title}</h2>
    {children}
  </section>
);

// A title with the content of a section
export const OrganizationSubheaderSection = ({ children, title, className }: {
  children: React.ReactNode
  title: string
  className: string
}) => (
  <section className={className} id="services">
    <header className="service--section--header">
      <h4>{title}</h4>
    </header>
    {children}
  </section>
);
