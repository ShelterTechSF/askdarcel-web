import React from 'react';
import { Service } from '../../models';
import { ServiceDetails } from './ServiceDetails';

export function ServiceList({ services }: { services: Service[] }) {
  return services?.length > 0
    ? (
      <ul className="service--section--list" data-cy="service-list">
        {services.map(service => (
          <ServiceDetails service={service} key={service.id} />
        ))}
      </ul>
    ) : null;
}
