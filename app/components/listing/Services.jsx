import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import DetailedHours from './DetailedHours';
import Notes from './Notes';

const Services = ({ services }) => services && services.length > 0
      && (
        <ul className="service--section--list">
          {services.map(service => (
            <Service service={service} key={service.id} />
          ))}
        </ul>
      );

/* eslint-disable react/no-multi-comp */
class Service extends Component {
  constructor() {
    super();
    this.state = { infoHidden: true };
    this.toggleVisible = this.toggleVisible.bind(this);
  }

  toggleVisible() {
    this.setState(({ infoHidden }) => ({ infoHidden: !infoHidden }));
  }

  render() {
    const { infoHidden } = this.state;
    const { service } = this.props;

    return (
      <li className="service" id={`service-${service.id}`}>
        <div className="service--meta disabled-feature">
          <p><ServiceCategory category={service.category} /></p>
          <p>
updated
            {service.updated_date}
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
          onClick={this.toggleVisible}
          role="button"
          tabIndex="0"
        >
          { infoHidden
            && (
              <span>
                More Info
                <i className="material-icons">keyboard_arrow_down</i>
              </span>
            )
          }
        </div>

        { !infoHidden && (
          <div className="service-application-process-container">
            <ul className="service--details">
              <ServiceContactDetails email={service.email} website={service.url} />
              <ServiceEligibility
                subject="How to apply"
                result={service.application_process}
              />
              <ServiceEligibility
                subject="Eligibilities"
                result={service.eligibility}
              />
              <ServiceEligibility
                subject="Required documents"
                result={service.required_documents}
              />
              <ServiceEligibility
                subject="Fees"
                result={service.fee}
              />
              {service.notes.length ? <Notes notes={service.notes} /> : null }
              <WeeklyHours schedule={service.schedule} />
            </ul>
            <div
              role="button"
              tabIndex={0}
              className="service--details-toggle"
              onClick={this.toggleVisible}
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
  }
}

const WeeklyHours = ({ schedule: { schedule_days } }) => schedule_days.length > 0 && (
  <li className="service--details--item">
    <header>Hours</header>
    <div className="service--details--item--info">
      <DetailedHours schedule={schedule_days} />
    </div>
  </li>
);

const ServiceCategory = ({ category }) => (
  <span>{category}</span>
);

const ServiceContactDetails = ({ email, website }) => {
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

const ServiceEligibility = ({ result, subject }) => result && (
  <li className="service--details--item">
    <header>{subject}</header>
    <ReactMarkdown className="rendered-markdown service--details--item--info">{result}</ReactMarkdown>
  </li>
);

export default Services;
