
import React, { Component } from 'react';
import {AddressInfo, BusinessHours, PhoneNumber, ResourceCategories, Website, Languages, StreetView} from './ResourceInfos';
import CommunicationBoxes from './CommunicationBoxes';
import Services from './Services';
import Loader from '../Loader';
import ResourceMap from './ResourceMap';
import { Link } from 'react-router';

class Resource extends Component {
  constructor(props) {
    super(props);
    this.state = { resource: null };
  }

  loadResourceFromServer() {
    let { query } = this.props.location;
    let resourceID = query.id;
    let url = '/api/resources/' + resourceID;
    fetch(url).then(r => r.json())
    .then(data => {
      this.setState({resource: data.resource});
    })
    ;
  }

  componentDidMount() {
    this.loadResourceFromServer();
  }

  render() {
    const { resource } = this.state;
    return ( !resource || !window.google ? <Loader /> :
      <div className="org-container">
        <article className="org">
          <section className="org-summary">
            <header className="org-header">
              <div className="org-map">
                <ResourceMap name={resource.name} lat={ resource.address.latitude} long={resource.address.longitude} />
                <StreetView address={resource.address} />
              </div>
              <div className="org-info">
                <div className="org-details">
                  <h1 className="org-title">{resource.name}</h1>
                  <div className="org-rating-summary disabled-feature">
                    <p className="excellent">{Math.floor(Math.random()*10)%6} <i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i></p>
                  </div>
                  <div className="org-desc">
                    <p>{resource.long_description || resource.short_description || "No Description available"}</p>
                  </div>
                </div>
                <div className="org-cta">
                  <a 
                    href={`https://maps.google.com?saddr=Current+Location&daddr=${resource.address.latitude},${resource.address.longitude}&dirflg=w`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-btn" 
                  />
                  <p className="org-distance">{this.props.location.query.time || ''}</p>
                </div>
              </div>
            </header>

            <Services description={resource.long_description} services={resource.services}/>

            <ul className="org-meta">
              <AddressInfo address={resource.address} />
              <BusinessHours schedule_days={resource.schedule.schedule_days} />
              <PhoneNumber phones={resource.phones} />
              <Website website={resource.website} />
              <Languages />
              <li>
                <i className="material-icons">edit</i>
                <p>
                    <Link to={{ pathname: "/resource/edit", query: { resourceid: resource.id } }} className="button">
                        Make Edits
                    </Link>
                </p>
              </li>
            </ul>
          </section>
        </article>
      </div>
    );
  }
}



export default Resource;
