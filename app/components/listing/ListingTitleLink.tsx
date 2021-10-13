import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { OrganizationCard } from './OrganizationCard';
import { ServiceCard } from './ServiceCard';
import { Service, Organization } from '../../models';

export const ListingTitleLink = ({ listing, type }: { listing: Service; type: 'service' } | { listing: Organization; type: 'org' }) => {
  const isService = type === 'service';
  const to = isService ? `/services/${listing.id}` : `/organizations/${listing.id}`;
  const summaryCard = type === 'service' ? <ServiceCard service={listing as Service} /> : <OrganizationCard org={listing as Organization} />;

  return (
    <Tooltip
      arrow
      className="popover"
      hideDelay={2000}
      html={<BrowserRouter>{summaryCard}</BrowserRouter>}
      theme="light"
    >
      <Link to={to}>{listing.name}</Link>
    </Tooltip>
  );
};
