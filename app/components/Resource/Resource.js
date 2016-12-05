
import React, { Component } from 'react';
import {AddressInfo, BusinessHours, PhoneNumber, ResourceCategories, Website, Languages, StreetView} from './ResourceInfos';
import CommunicationBoxes from './CommunicationBoxes';
import Services from './Services';
import Loader from '../Loader';
import ResourceMap from './ResourceMap';

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
    return ( !this.state.resource ? <Loader /> :
      <div className="org-container">
        <article className="org">
          <section className="org-summary">
            <header className="org-header">
              <div className="org-map">
                <ResourceMap name={this.state.resource.name} lat={ this.state.resource.address.latitude} long={this.state.resource.address.longitude} />
                <StreetView address={this.state.resource.address} />
              </div>
              <div className="org-info">
                <div className="org-details">
                  <h1 className="org-title">{this.state.resource.name}</h1>
                  <div className="org-rating-summary disabled-feature">
                    <p className="excellent">{Math.floor(Math.random()*10)%6} <i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i></p>
                  </div>
                  <div className="org-desc">
                    <p>{this.state.resource.long_description || this.state.resource.short_description || "No Description available"}</p>
                  </div>
                </div>
                <div className="org-cta">
                  <a href="" className="directions-btn"></a>
                  <p className="org-distance">15 min</p>
                </div>
              </div>
            </header>

            <Services description={this.state.resource.long_description} services={this.state.resource.services}/>

            <ul className="org-meta">
              <AddressInfo address={this.state.resource.address} />
              <BusinessHours schedule_days={this.state.resource.schedule.schedule_days} />
              <PhoneNumber phones={this.state.resource.phones} />
              <Website website={this.state.resource.website} />
              <Languages />
              <li>
                <i className="material-icons">edit</i>
                <p><a href="#" className="button">Make Edits</a></p>
              </li>
            </ul>
          </section>
        </article>
      </div>
    );
  }
}



export default Resource;
