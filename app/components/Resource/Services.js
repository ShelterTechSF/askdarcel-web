import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import DetailedHours from './DetailedHours';

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
    const { infoHidden } = this.state;
    const { service } = this.props

    return (
		<li className="service" id={`service-${this.props.service.id}`} >
			<div className="service--meta disabled-feature">
				<p><ServiceCategory category={this.props.service.category} /></p>
				<p>updated {this.props.service.updated_date}</p>
			</div>
      <h2 className="service--header">{this.props.service.name}</h2>
      <ReactMarkdown className="service--description" source={this.props.service.long_description} />
      <div className="service--details-toggle" onClick={this.toggleVisible}>
        <span>{infoHidden ?
            <span>More Info <i className="material-icons">keyboard_arrow_down</i></span> :
            null}</span>
      </div>

      { infoHidden ? null :
        <div className="service-application-process-container">
          <ul className="service--details">
            <ServiceContactDetails email={service.email}/>
            <ServiceEligibility subject='How to apply' result={this.props.service.application_process}/>
            <ServiceEligibility subject='Eligibilities' result={this.props.service.eligibility}/>
            <ServiceEligibility subject='Required documents' result={this.props.service.required_documents}/>
            <ServiceEligibility subject='Fees' result={this.props.service.fee}/>
            {this.props.service.notes.length ? <Notes notes={this.props.service.notes}/> : null  }
            <WeeklyHours schedule={this.props.service.schedule} />
          </ul>
          <div className="service--details-toggle" onClick={this.toggleVisible}>
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
				<div className="service--details--item--info"><DetailedHours schedule={this.props.schedule.schedule_days} /></div>
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
  render () {
    const { email } = this.props
    return email ? (
      <li className="service--details--item">
        <header>Contact Info</header>
        <div className="service--details--item--info">
          <p>Email: <a href={'mailto:' + email}>{email}</a></p>
        </div>
      </li>
    ) : null
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
    let notes = this.props.notes ?  this.props.notes.map((note, i) => {
      return <Note note={note} key={i} />
    }) : [];

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
