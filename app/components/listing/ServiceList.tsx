import React from 'react';
import { Service } from '../../models';
import { ServiceDetails } from './ServiceDetails';

export const ServiceList = ({ services }: { services: Service[] }) => (services?.length > 0
  ? (
    <ul className="service--section--list" data-cy="service-list">
      {services.map(service => (
        <ServiceDetails service={service} key={service.id} />
      ))}
    </ul>
  ) : null);
