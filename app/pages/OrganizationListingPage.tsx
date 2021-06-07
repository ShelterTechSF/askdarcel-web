import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// import { MapOfLocations } from 'components/maps';
import MOHCDBadge from 'components/listing/MOHCDBadge';
import Loader from 'components/ui/Loader';
import {
  ActionSidebar,
  AddressDisplay,
  Categories,
  EmailAddress,
  ListingSection,
  MobileActionBar,
  NotesSection,
  PhoneNumbers,
  // RelativeOpeningTime,s
  ServiceInfo,
  // TableOfOpeningTimes,
  WebsiteLink,
} from '../components/listing';
import * as dataService from '../utils/DataService';
import { getSiteTitle } from '../utils/whitelabel';
import { OrganizationModel } from '../models';

export const OrganizationListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<OrganizationModel|null>(null);

  useEffect(() => {
    dataService.getResource(id)
      .then(resource => setResource(resource));
  }, [id]);

  const verifyResource = useCallback(() => {
    //   const changeRequest = {
    //     verified_at: new Date().toISOString(),
    //   };
    //   dataService.post(`/api/resources/${id}/change_requests`, { change_request: changeRequest }).then(response => {
    //     // TODO: Do not use alert() for user notifications.
    //     if (response.ok) {
    //       alert('Resource verified. Thanks!'); // eslint-disable-line no-alert
    //     } else {
    //       alert('Issue verifying resource. Please try again.'); // eslint-disable-line no-alert
    //     }
    //   });
  }, [resource, id]);

  if (!resource || !(window as any).google) {
    return <Loader />;
  }

  return (
    <div>
      <Helmet>
        <title>
          {`${resource.name} | ${getSiteTitle()}`}
        </title>
        <meta name="description" content={resource.long_description} />
      </Helmet>
      <div className="org-container">
        <article className="org" id="resource">
          <div className="org--main">
            <div className="org--main--left">
              <header className="org--main--header">
                <div className="org--main--header--title-container">
                  <h1 className="org--main--header--title">{resource.name}</h1>
                  <MOHCDBadge resource={resource} />
                </div>
                <div className="org--main--header--hours">
                  {/* <RelativeOpeningTime recurringSchedule={resource.recurringSchedule} /> */}
                </div>
                { resource.phones.length > 0
                  && (
                    <div className="org--main--header--phone">
                      <PhoneNumbers phones={resource.phones} />
                    </div>
                  )
                }
              </header>
              <MobileActionBar resource={resource} />

              <div className="org--main--header--description">
                <h2>About This Organization</h2>
                <ReactMarkdown className="rendered-markdown" source={resource.long_description || resource.short_description || 'No Description available'} />
              </div>

              <ListingSection title="Services" id="service">
                <ul>
                  { resource.services.map(s => <li><ServiceInfo service={s} /></li>) }
                </ul>
              </ListingSection>

              <NotesSection notes={resource.notes} />

              <ListingSection title="Info" id="info">
                {resource.categories.length > 0 && <Categories categories={resource.categories} />}
                {resource.addresses.map(address => (<AddressDisplay address={address} key={address.id} />))}
                {resource.phones.length > 0 && <PhoneNumbers phones={resource.phones} />}
                {resource.website && <WebsiteLink url={resource.website} />}
                {resource.email && <EmailAddress email={resource.email} />}
              </ListingSection>

              {/* { resource.addresses?.length && (
              <ListingSection title="Location" id="service">
                <MapOfLocations
                  locations={resource.addresses}
                  locationRenderer={(loc: any) => <TableOfOpeningTimes recurringSchedule={loc.recurringSchedule} />}
                />
              </ListingSection>
) } */}

              {/* {resourceLocations && (
                <section className="location--section">
                  <header className="service--section--header">
                    <h4>Location</h4>
                  </header>
                  <MapOfLocations
                    locations={resourceLocations}
                    locationRenderer={location => (
                      <TableOfOpeningTimes
                        recurringSchedule={location.recurringSchedule}
                      />
                    )}
                  />
                </section>
              )} */}
            </div>

            <div className="org--aside">
              <ActionSidebar resource={resource} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
