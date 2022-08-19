import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Notes } from './Notes';
import { Service, RecurringSchedule } from '../../models';

import ServiceVerified from '../../assets/img/ic-attributed-record.svg';
import './ServiceDetails.scss';

export const ServiceDetails = ({ service }: { service: Service }) => {
  const [infoHidden, setInfoHidden] = useState(true);
  const toggleInfoHidden = () => setInfoHidden(!infoHidden);

  return (
    <li className="service" id={`service-${service.id}`} data-cy="service-list-item">
      {/* <div className="service--meta disabled-feature">
        <p><ServiceCategory category={service.category} /></p>
        <p>updated {service.updated_at}</p>
      </div> */}
      <h2 className="service--header">
        <a href={`/services/${service.id}`}>
          {service.name}
        </a>
      </h2>
      <ReactMarkdown className="rendered-markdown service--description" source={service.long_description} />
      <div
        className="service--details-toggle"
        onClick={toggleInfoHidden}
        role="button"
        tabIndex={0}
      >
        { infoHidden
          && (
            <span>
              More Info
              <i className="material-icons">keyboard_arrow_down</i>
            </span>
          )}
      </div>

      { !infoHidden && (
        <div className="service-application-process-container">
          <ul className="service--details">
            <ServiceContactDetails email={service.email} website={service.url} />
            <ServiceEligibility subject="How to apply" result={service.application_process} />
            <ServiceEligibility subject="Required documents" result={service.required_documents} />
            <ServiceEligibility subject="Fees" result={service.fee} />
            {service.notes.length ? <Notes notes={service.notes} /> : null }
            {service.recurringSchedule.intervals.length > 0
              && <WeeklyHours recurringSchedule={service.recurringSchedule} />}
          </ul>
          <div
            role="button"
            tabIndex={0}
            className="service--details-toggle"
            onClick={toggleInfoHidden}
          >
            <span>
              Less Info
              <i className="material-icons">keyboard_arrow_up</i>
            </span>
          </div>
        </div>
      )}
    </li>
  );
};

const WeeklyHours = ({ recurringSchedule }: { recurringSchedule: RecurringSchedule }) => (
  <li className="service--details--item">
    <header>Hours</header>
    <div className="service--details--item--info">
      <DetailedHours recurringSchedule={recurringSchedule} />
    </div>
  </li>
);

const ServiceContactDetails = ({ email, website }: {
  email?: string|null;
  website?: string|null;
}) => {
  if (!(email || website)) {
    return null;
  }
  return (
    <li className="service--details--item">
      <header>Contact Info</header>
      <div className="service--details--item--info">
        {email && (
          <p>
            {'Email: '}
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
        {website && (
          <p>
            {'Website: '}
            <a href={website}>{website}</a>
          </p>
        )}
      </div>
    </li>
  );
};

const ServiceEligibility = ({ result, subject }: {
  result: string|null;
  subject: string;
}) => (result ? (
  <li className="service--details--item">
    <header>{subject}</header>
    <ReactMarkdown className="rendered-markdown service--details--item--info">{result}</ReactMarkdown>
  </li>
) : null);

const DetailedHours = ({ recurringSchedule }: { recurringSchedule: RecurringSchedule }) => (
  <span className="weekly-hours-list">
    {
      (
        recurringSchedule.hoursKnown
          ? (recurringSchedule.intervals.map(interval => (
            <div key={interval.key()} className="weekly-hours-list--item">
              <span className="weekly-hours-list--item--day">{interval.opensAt.dayString()}</span>
              <span className="weekly-hours-list--item--hours">
                { interval.is24Hours()
                  ? '24 Hours'
                  : `${interval.opensAt.timeString()} - ${interval.closesAt.timeString()}`}
              </span>
            </div>
          )))
          : (<div className="weekly-hours-list--item">Call for Hours</div>)
      )
    }
  </span>
);

export const ServiceAttribution = ({ attribution, status }: {
  attribution: string;
  status: string;
}) => {
  const benetechLink = 'https://medium.com/@Shelter_Tech/sheltertech-is-participating-'
  + 'in-the-benetech-service-net-pilot-in-the-san-francisco-bay-area-b28645d3dee6';
  const isServiceNetAttribution = attribution === 'service_net' && status === 'approved';

  return isServiceNetAttribution ? (
    <div className="attributed-service">
      <p className="attributed-service-resource-text">
        <span className="attributed-service-icon-container">
          <img
            src={ServiceVerified}
            alt="Record Verified by Service Net partner"
            className="listing-menu--button-icon"
          />
        </span>
        <span className="attributed-service-text">We&apos;ve updated this record thanks to a </span>
        <a className="attributed-service-link" href={benetechLink} target="_blank" rel="noopener noreferrer">
          Service Net Partner
        </a>
      </p>
    </div>
  ) : null;
};
