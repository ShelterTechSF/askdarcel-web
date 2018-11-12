import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import DetailedHours from './DetailedHours';
import Notes from './Notes';

class Services extends Component {
  constructor(props) {
    super(props);
    this.renderServicesSection.bind(this);
  }

  renderServicesSection() {
    return this.props.services && this.props.services.length > 0
      ? (
          <ul className="service--section--list">
            {this.props.services.map((service, i) => (
              <Service service={service} key={i} />
            ))}
          </ul>
      ) : null;
  }

  render() {
    return this.renderServicesSection();
  }
}

/* eslint-disable react/no-multi-comp */
class Service extends Component {
  constructor() {
    super();
    this.state = { infoHidden: true };
    this.toggleVisible = this.toggleVisible.bind(this);
  }

  toggleVisible() {
    this.setState({ infoHidden: !this.state.infoHidden });
  }

  render() {
    const { infoHidden } = this.state;
    const { service } = this.props;

    return (
      <li className="service" id={`service-${service.id}`} >
        <div className="service--meta disabled-feature">
          <p><ServiceCategory category={service.category} /></p>
          <p>updated {service.updated_date}</p>
        </div>
        <h2 className="service--header">{service.name}</h2>
        <ReactMarkdown className="service--description" source={service.long_description} />
        <div
          className="service--details-toggle"
          onClick={this.toggleVisible}
          role="button"
          tabIndex="0"
        >
          { infoHidden
            ? <span>More Info <i className="material-icons">keyboard_arrow_down</i></span>
            : null
          }
        </div>

        { infoHidden ? null :
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
            <span>{infoHidden ?
                null :
                <span>Less Info <i className="material-icons">keyboard_arrow_up</i></span>}</span>
          </div>
        </div>
      }
      </li>
    );
  }
}

class WeeklyHours extends Component {
  render() {
    return this.props.schedule.schedule_days.length > 0 ? (
      <li className="service--details--item">
        <header>Hours</header>
        <div className="service--details--item--info">
          <DetailedHours schedule={this.props.schedule.schedule_days} />
        </div>
      </li>
    ) : null;
  }
}


class ServiceCategory extends Component {
  render() {
    return (
      <span>{this.props.category}</span>
    );
  }
}

class ServiceContactDetails extends Component {
  render() {
    const { email, website } = this.props;
    return email || website ? (
      <li className="service--details--item">
        <header>Contact Info</header>
        <div className="service--details--item--info">
          {email && <p>Email: <a href={'mailto:' + email}>{email}</a></p>}
          {website && <p>Website: <a href={website}>{website}</a></p>}
        </div>
      </li>
    ) : null;
  }
}

class ServiceEligibility extends Component {
  render() {
    return this.props.result ? (
      <li className="service--details--item">
        <header>{this.props.subject}</header>
        <div className="service--details--item--info">{this.props.result}</div>
      </li>
    ) : null;
  }
}

export default Services;
