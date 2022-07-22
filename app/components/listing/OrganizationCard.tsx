import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StreetViewImage } from './StreetViewImage';
import { Organization } from '../../models';

export function OrganizationCard({ org }: { org: Organization }) {
  const address = org.addresses[0];
  const shortDescription = useMemo(() => org.short_description || org.long_description?.split('\n')[0], [org]);
  const maxHeight = '106px';

  return (
    <Link to={`/organizations/${org.id}`} className="card" style={{ maxHeight }}>
      {address ? <StreetViewImage address={address} size={maxHeight} /> : null}
      <header className="content">
        <h3>{ org.name }</h3>
        <h4>
          <span>{ address?.address_1 }</span>
          {/* TODO Walking distance */}
        </h4>
        {/* TODO Add Rating */}
        <p>{shortDescription}</p>
      </header>
    </Link>
  );
}
