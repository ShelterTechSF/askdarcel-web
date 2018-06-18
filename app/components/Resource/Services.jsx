import React, { Component } from 'react';
import DetailedHours from './DetailedHours';

class Services extends Component {
  constructor(props) {
    super(props);
    this.renderServices.bind(this);
    this.renderServicesSection.bind(this);
  }

  renderServicesSection() {
    return this.props.services && this.props.services.length > 0
      ? (
        <div>
          {this.renderServices(this.props.services)}
        </div>
      ) : null;
  }

  /* eslint-disable class-methods-use-this */
  renderServices(services) {
    return services.map(service => <Service service={service} key={service.id} />);
  }

  render() {
    return (
      <div className="services-container">
        {this.renderServicesSection()}
      </div>
    );
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
    return (
      <li className="service" id={`service-${this.props.service.id}`} >
        <div className="service--meta disabled-feature">
          <p><ServiceCategory category={this.props.service.category} /></p>
          <p>updated {this.props.service.updated_date}</p>
        </div>
        <h2 className="service--header">{this.props.service.name}</h2>
        <p className="service--description">{this.props.service.long_description}</p>
        <div
          role="button"
          tabIndex={0}
          className="service--details-toggle"
          onClick={this.toggleVisible}
        >
          <span>{infoHidden ?
            <span>More Info <i className="material-icons">keyboard_arrow_down</i></span> :
            null}</span>
        </div>

        { infoHidden ? null :
        <div className="service-application-process-container">
          <ul className="service--details">
            <ServiceEligibility
              subject="How to apply"
              result={this.props.service.application_process}
            />
            <ServiceEligibilities
              subject="Eligibilities"
              eligibilities={this.props.service.eligibilities}
            />
            <ServiceEligibility
              subject="Required documents"
              result={this.props.service.required_documents}
            />
            <ServiceEligibility
              subject="Fees"
              result={this.props.service.fee}
            />
            {this.props.service.notes.length ? <Notes notes={this.props.service.notes} /> : null }
            <WeeklyHours schedule={this.props.service.schedule} />
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

class ServiceEligibilities extends Component {
  render() {
    return this.props.eligibilities.length > 0 ? (
      <li className="service--details--item">
        <header>{this.props.subject}</header>
        <div className="service--details--item--info">
          {this.props.eligibilities.map(eligibility => <p>{eligibility.name}</p>)}
        </div>
      </li>
    ) : null;
  }
}

class Notes extends Component {
  render() {
    const notes = this.props.notes
      ? this.props.notes.map(note => <Note note={note} key={note.id} />)
      : [];

    return (
      <li className="service--details--item">
        <header>Notes</header>
        <ul className="service--details--item--info">{notes}</ul>
      </li>
    );
  }
}

class Note extends Component {
  render() {
    return (
      <li className="services--details--notes-list--item">{this.props.note.note}</li>
    );
  }
}

export default Services;
