import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ServiceModel } from '../../models';
import { NotesSection } from './MetaInfo';
import { WeeklyHours } from './OpeningTimes';

export const ServiceInfo = ({ service }: { service: ServiceModel }) => {
  const [condensed, setCondensed] = useState(true);

  return (
    <li className="service" id={`service-${service.id}`}>
      <div className="service--meta disabled-feature">
        {/* <p><ServiceCategory category={service.category} /></p> */}
        <p>
          updated
          {service.updated_at}
        </p>
      </div>
      <h2 className="service--header">
        <a href={`/services/${service.id}`}>
          {service.name}
        </a>
      </h2>
      <ReactMarkdown className="rendered-markdown service--description" source={service.long_description} />
      <div
        className="service--details-toggle"
        onClick={() => setCondensed(!condensed)}
        role="button"
        tabIndex={0}
      >
        { condensed
          && (
            <span>
              More Info
              <i className="material-icons">keyboard_arrow_down</i>
            </span>
          )
        }
      </div>

      { !condensed && (
        <div className="service-application-process-container">
          <ul className="service--details">
            <ServiceContactDetails email={service.email} website={service.url} />
            <ServiceEligibility subject="How to apply" result={service.application_process} />
            <ServiceEligibility subject="Eligibilities" result={service.eligibility} />
            <ServiceEligibility subject="Required documents" result={service.required_documents} />
            <ServiceEligibility subject="Fees" result={service.fee} />
            {service.notes.length ? <NotesSection notes={service.notes} /> : null }
            {service.recurringSchedule.intervals.length > 0 && <WeeklyHours recurringSchedule={service.recurringSchedule} />}
          </ul>
          <div
            role="button"
            tabIndex={0}
            className="service--details-toggle"
            onClick={() => setCondensed(!condensed)}
          >
            <span>
              Less Info
              <i className="material-icons">keyboard_arrow_up</i>
            </span>
          </div>
        </div>
      )
      }
    </li>
  );
};

const ServiceContactDetails = ({ email, website }: { email: string, website: string }) => {
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

const ServiceEligibility = ({ result, subject }: { subject: string, result: string }) => (result ? (
  <li className="service--details--item">
    <header>{subject}</header>
    <ReactMarkdown className="rendered-markdown service--details--item--info">{result}</ReactMarkdown>
  </li>
) : null);
