import React, { Component } from 'react';
import classNames from 'classnames';

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
    this.state = {infoHidden: true};
  }

  toggleVisible() {
    this.setState({infoHidden: !this.state.infoHidden});
  }

  render() {
    let serviceInfoContainerStyles = classNames('service-details', {hidden: this.state.infoHidden});

    return (
      <section className="service">
        <h2 className="service-header">{this.props.service.name}</h2>
        <div className={serviceInfoContainerStyles}>
          <p className="service-description">{this.props.service.long_description}</p>
        </div>
        <div className="service-application-process-container">
          <p className="service-application-header">What To Do Next</p>
          <div className="service-application-process">{this.props.service.application_process}
            <Notes notes={this.props.service.notes}/>
          </div>
          <ul className="service-table">
            <ServiceEligibility subject='Who can use this service' result={this.props.service.eligibility}/>
            <ServiceEligibility subject='What documents do you need to apply' result={this.props.service.required_documents}/>
            <ServiceEligibility subject='How much does it cost' result={this.props.service.fee}/>
          </ul>
        </div>
      </section>
    );
  }
}

class ServiceEligibility extends Component {
  render() {
    return this.props.result ? (
      <li className="service-table-row">
        <p className="service-table-cell subjectcell">{this.props.subject+':'}</p>
        <p className="service-table-cell">{this.props.result}</p>
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
      <p>{notes}</p>
    );
  }
}

class Note extends Component {
  render() {
    return (
      <span className="service_row">{this.props.note.note}</span>
    );
  }
}

function formatDate(dateString) {
  let date = new Date(dateString);
  return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear();
}

export default Services;
