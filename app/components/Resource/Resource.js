import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { AddressInfo, TodaysHours, PhoneNumber, ResourceCategories, Website, StreetView } from './ResourceInfos';
import DetailedHours from './DetailedHours';
import Services from './Services';
import Notes from './Notes';
import Loader from '../Loader';
import ResourceMap from './ResourceMap';
import * as dataService from '../../utils/DataService';

function scrollToElement(selector) {
  const elem = document.getElementById(selector);
  if (elem) {
    elem.scrollIntoView({ block: 'start', behaviour: 'smooth' });
  }
}

class Resource extends Component {
  constructor(props) {
    super(props);
    this.state = { resource: null };
    this.verifyResource = this.verifyResource.bind(this);
  }

  componentDidMount() {
    this.loadResourceFromServer();
  }

  loadResourceFromServer() {
    const { query } = this.props.location;
    const resourceID = query.id;
    const url = `/api/resources/${resourceID}`;
    fetch(url).then(r => r.json())
    .then((data) => {
      this.setState({ resource: data.resource });
    });
  }

  verifyResource() {
    const changeRequest = { verified_at: new Date().toISOString() };
    dataService.post(`/api/resources/${this.state.resource.id}/change_requests`, { change_request: changeRequest })
      .then((response) => {
        // TODO: Do not use alert() for user notifications.
        if (response.ok) {
          alert('Resource verified. Thanks!');  // eslint-disable-line no-alert
        } else {
          alert('Issue verifying resource. Please try again.');  // eslint-disable-line no-alert
        }
      });
  }

  render() {
    const { resource } = this.state;
    return (!resource || !window.google ? <Loader /> :
    <div className="org-container">
      <article className="org" id="resource">
        <div className="org--map">
          <ResourceMap
            name={resource.name}
            lat={resource.address.latitude}
            long={resource.address.longitude}
            userLocation={this.props.userLocation}
          />
          <StreetView address={resource.address} resourceName={resource.name} />
        </div>
        <div className="org--main">
          <div className="org--main--left">

            <header className="org--main--header">
              <h1 className="org--main--header--title">{resource.name}</h1>
              <div className="org--main--header--rating disabled-feature">
                <p className="excellent">
                  <i className="material-icons">sentiment_very_satisfied</i>
                  <i className="material-icons">sentiment_very_satisfied</i>
                  <i className="material-icons">sentiment_very_satisfied</i>
                  <i className="material-icons">sentiment_very_satisfied</i>
                  <i className="material-icons">sentiment_very_satisfied</i>
                </p>
              </div>
              <div className="org--main--header--hours">
                <TodaysHours schedule_days={resource.schedule.schedule_days} />
              </div>
              <div className="org--main--header--phone">
                <PhoneNumber phones={resource.phones} />
              </div>
              <div className="org--main--header--description">
                <header>About this resource</header>
                <p>{resource.long_description || resource.short_description || 'No Description available'}</p>
              </div>
            </header>

            <section className="service--section" id="services">
              <header className="service--section--header">
                <h4>Services</h4>
              </header>
              <ul className="service--section--list">
                <Services description={resource.long_description} services={resource.services} />
              </ul>
            </section>

            <Notes notes={this.state.resource.notes} />

            <section className="info--section" id="info">
              <header className="service--section--header">
                <h4>Info</h4>
              </header>
              <ul className="info">
                <div className="info--column">
                  <ResourceCategories categories={resource.categories} />
                  <AddressInfo address={resource.address} />
                  <PhoneNumber phones={resource.phones} />
                  <Website website={resource.website} />
                  <span className="website">
                    <a href={`mailto:${this.state.resource.email}`} target="_blank" rel="noopener noreferrer">{this.state.resource.email}</a>
                  </span>
                </div>
                <div className="info--column">
                  <DetailedHours schedule={resource.schedule.schedule_days} />
                </div>
              </ul>
            </section>
          </div>

          <div className="org--aside">
            <div className="org--aside--content">
              <a
                href={`https://maps.google.com?saddr=Current+Location&daddr=${resource.address.latitude},${resource.address.longitude}&dirflg=w`}
                target="_blank"
                rel="noopener noreferrer"
                className="org--aside--content--button directions-button"
              >
                Get Directions
              </a>
              <Link to={{ pathname: '/resource/edit', query: { resourceid: resource.id } }} className="org--aside--content--button edit-button">
                  Make Edits
              </Link>
              <button
                className="org--aside--content--button"
                onClick={this.verifyResource}
              >
                Mark Info as Correct
              </button>
              <nav className="org--aside--content--nav">
                <ul>
                  <li><a href="#resource">{resource.name}</a></li>
                  <li><a href="#services">Services</a>
                    <ul className="service--nav--list">
                      {
                        resource.services.map(service => (
                          <li key={service.id}>
                            <a href={`#service-${service.id}`} onClick={scrollToElement(`service-${service.id}`)}>
                              {service.name}
                            </a>
                          </li>
                        ))
                      }
                    </ul>
                  </li>
                  <li><a href="#info">Info</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </article>
    </div>
    );
  }
}

Resource.defaultProps = {
  userLocation: null,
};

Resource.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      resourceid: PropTypes.string,
    }).isRequired,
  }).isRequired,
  // Not required because will be lazy-loaded after initial render.
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default Resource;
