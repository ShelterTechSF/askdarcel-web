import React, { Component } from 'react';
import classNames from 'classnames';
import Hours from './Hours';

class Services extends Component {
  constructor(props) {
    super(props);
    this.renderServices.bind(this);
    this.renderServicesSection.bind(this);
  }

  renderServicesSection() {
    if(this.props.services && this.props.services.length > 0) {
      return (
        <div>
          {this.renderServices(this.props.services)}
        </div>
      );
    }
  }

  renderServices(services) {
    return services.map((service, i) => {
      return <Service service={service} key={i} />
    });
  }

  render() {
    return (
      <div className="services-container">
        {/* <div className="innercontainer">
              <h4>Description</h4>
              <p>{this.props.description}</p>
            </div> */}
        {this.renderServicesSection()}
      </div>
    );
  }
}

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
    let { infoHidden } = this.state;
    return (
      <section className="service">
        <h2 className="service-header">{this.props.service.name}</h2>
        <div className="service-details">
          <p className="service-description">{this.props.service.long_description}</p>
        </div>
        <div className="details-toggle" onClick={this.toggleVisible}>
          <span>{infoHidden ? 
              <span><i className="material-icons">keyboard_arrow_down</i>More Info</span> :
              null}</span>
        </div>
        { infoHidden ? null :
          <div className="service-application-process-container">
            <ul className="org-meta">
              <ServiceEligibility subject='HOW TO APPLY' result={this.props.service.application_process}/>
              <ServiceEligibility subject='ELGIBILITY' result={this.props.service.eligibility}/>
              <ServiceEligibility subject='REQUIRED DOCUMENTS' result={this.props.service.required_documents}/>
              <ServiceEligibility subject='FEES' result={this.props.service.fee}/>
              <Hours schedule={this.props.service.schedule.schedule_days} />
              <Notes notes={this.props.service.notes}/>
            </ul>
            <div className="details-toggle" onClick={this.toggleVisible}>
              <span>{infoHidden ? 
                  null :
                  <span><i className="material-icons">keyboard_arrow_up</i>Less Info</span>}</span>
            </div>
          </div>
      }
      </section>
    );
  }
}

class ServiceEligibility extends Component {
  render() {
    return this.props.result ? (
      <li>
        <div>{this.props.subject}</div>
        <div className="service-row">{this.props.result}</div>
      </li>
    ) : null;
  }
}

class Notes extends Component {
  render() {
    let notes = this.props.notes.map((note, i) => {
      return <Note note={note} key={i} />
    });

    return (
      <li>
        <div>NOTES</div>
        <ul>{notes}</ul>
      </li>
    );
  }
}

class Note extends Component {
  render() {
    return (
      <li className="service-row">{this.props.note.note}</li>
    );
  }
}

function formatDate(dateString) {
  let date = new Date(dateString);
  return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
}

export default Services;
