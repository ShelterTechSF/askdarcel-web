
import React, { Component } from 'react';
import {AddressInfo, TodaysHours, PhoneNumber, WeeklyHours, ResourceCategories, Website, Languages, StreetView} from './ResourceInfos';
import DetailedHours from './DetailedHours';
import CommunicationBoxes from './CommunicationBoxes';
import Services from './Services';
import Notes from './Notes';
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
      data.resource.notes.push({note: "meow meow meowm oemwemmwwmowmoemowemow"});
      data.resource.notes.push({note: "dljfjdjdjkkjlklklakjaljkajk"});
      this.setState({resource: data.resource});
    });
  }

  componentDidMount() {
    this.loadResourceFromServer();
  }

  render() {
    const { resource } = this.state;
    return ( !resource || !window.google ? <Loader /> :
      <div className="org-container">
        <article className="org" id="resource">
	        <div className="org--map">
	          <ResourceMap name={resource.name} lat={ resource.address.latitude} long={resource.address.longitude} userLocation={this.props.userLocation} />
	          <StreetView address={resource.address} />
	        </div>
	        <div className="org--main">
						<div className="org--main--left">

		          <header className="org--main--header">
                <h1 className="org--main--header--title">{resource.name}</h1>
                <div className="org--main--header--rating disabled-feature">
                  <p className="excellent">{Math.floor(Math.random()*10)%6} <i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i><i className="material-icons">sentiment_very_satisfied</i></p>
                </div>
                <div className="org--main--header--hours">
                	<TodaysHours schedule_days={resource.schedule.schedule_days} />
<<<<<<< HEAD
                </div>
                <div className="org--main--header--phone">
                <PhoneNumber phones={resource.phones} />
                </div>
                <div className="org--main--header--description">
                	<header>About this resource</header>
                  <p>{resource.long_description || resource.short_description || "No Description available"}</p>
                </div>
=======
                </div>
                <div className="org--main--header--phone">
                <PhoneNumber phones={resource.phones} />
                </div>
                <div className="org--main--header--description">
                	<header>About this resource</header>
                  <p>{resource.long_description || resource.short_description || "No Description available"}</p>
                </div>
>>>>>>> master
		          </header>

		          <section className="service--section" id="services">
				      	<header className="service--section--header">
<<<<<<< HEAD
				      		<h4>Services {resource.services.length}</h4>
=======
				      		<h4>Services</h4>
>>>>>>> master
				      	</header>
				      	<ul className="service--section--list">
		          		<Services description={resource.long_description} services={resource.services}/>
				      	</ul>
				      </section>
<<<<<<< HEAD
=======

              <Notes notes={this.state.resource.notes} />
>>>>>>> master

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
<<<<<<< HEAD
=======
                    <span className="website">
                      <a href={"mailto:"+this.state.resource.email} target="_blank">{this.state.resource.email}</a>
                    </span>
>>>>>>> master
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
                <Link to={{ pathname: "/resource/edit", query: { resourceid: resource.id } }} className="org--aside--content--button edit-button">
                    Make Edits
                </Link>
		          	<nav className="org--aside--content--nav">
		          		<ul>
		          			<li><a href="#resource">{resource.name}</a></li>
		          			<li><a href="#services">Services</a></li>
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



export default Resource;
