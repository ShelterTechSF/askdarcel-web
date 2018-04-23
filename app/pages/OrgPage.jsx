import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchOrganization, createOrganizationChangeRequest } from 'models/organizations';
import { parseLocationInformation } from 'models/locations';

// import { Link } from 'react-router';
import { ServiceCard } from 'components/layout';
import { Loader, Datatable } from 'components/ui';
import { MapOfLocations } from 'components/maps';
import { ActionSidebar, TableOfContactInfo, TableOfOpeningTimes } from 'components/listing';
// import { AddressInfo, TodaysHours, PhoneNumber,
// ResourceCategories, Website, StreetView } from 'components/listing/ResourceInfos';
// import DetailedHours from 'components/listing/DetailedHours';
// import Services from 'components/listing/Services';
// import Notes from 'components/listing/Notes';
// import Loader from 'components/ui/Loader';
// import HAPcertified from 'assets/img/ic-hap.png';

// import * as dataService from 'utils/DataService';

// function scrollToElement(selector) {
//   const elem = document.getElementById(selector);
//   if (elem) {
//     elem.scrollIntoView({ block: 'start', behaviour: 'smooth' });
//   }
// }

class OrganizationPage extends Component {
  static generateDetailsRows() {
    // TODO None of this data exists
    const rows = [
      // ['Legal Status', ]
    ];
    return rows;
  }

  componentWillMount() {
    const { routeParams: { resource } } = this.props;
    this.props.fetchOrganization(resource);
  }

  // loadResourceFromServer() {
  //   const { routeParams: { service } } = this.props;
  //   const { query } = this.props.location;
  //   const resourceID = query.id;
  //   const url = `/api/resources/${resourceID}`;
  //   fetch(url, { credentials: 'include' }).then(r => r.json())
  //   .then((data) => {
  //     this.setState({ resource: data.resource });
  //   });
  // }

  // verifyResource() {
  //   const changeRequest = { verified_at: new Date().toISOString() };
  //   dataService.post(`/api/resources/${this.state.resource.id}/change_requests`,
  // { change_request: changeRequest })
  //     .then((response) => {
  //       // TODO: Do not use alert() for user notifications.
  //       if (response.ok) {
  //         alert('Resource verified. Thanks!');  // eslint-disable-line no-alert
  //       } else {
  //         alert('Issue verifying resource. Please try again.');  // eslint-disable-line no-alert
  //       }
  //     });
  // }

  render() {
    const { activeOrganization: organization } = this.props;
    if (!organization) { return (<Loader />); }

    const { address, name, long_description, services, schedule } = organization;
    return (
      <div className="listing-container">
        <article className="listing" id="organization">
          <div className="listing--main">
            <div className="listing--main--left">
              <header>
                <h1>{ name }</h1>
                { organization.alsoNamed ? <p>Also Known As</p> : null }
              </header>

              <section>
                <h2>About This Organization</h2>
                <p>{long_description}</p>
              </section>

              <section>
                <h2>Organization Details</h2>
                <TableOfContactInfo item={organization} />
                <Datatable
                  rowRenderer={d => (
                    <tr key={d.title}>
                      <th>{d.title}</th>
                      <td>{ Array.isArray(d.value) ? d.value.join('\n') : d.value }</td>
                    </tr>
                  )}
                  rows={OrganizationPage.generateDetailsRows()}
                />
              </section>

              {services.length && <section>
                <h2>Services Offered</h2>
                {
                  services.map(service => <ServiceCard key={service.id} service={service} />)
                }
              </section>}

              {/* TODO Programs go here */}

              <section>
                <h2>Locations and Hours</h2>
                <MapOfLocations
                  locations={[parseLocationInformation(name, address, schedule)]}
                  locationRenderer={location => (
                    <TableOfOpeningTimes schedule={location.schedule} />
                  )}
                />
                {/* TODO Transport Options */}
              </section>
            </div>
            <div className="listing--aside">
              <ActionSidebar actions={[
                { name: 'Edit', icon: 'edit', to: `/resource/edit?resourceid=${organization.id}` }, // TODO Update with path to /resource/:id
                { name: 'Print', icon: 'print', handler: () => { window.print(); } },
                { name: 'Directions', icon: 'directions', link: `http://google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}` },
                {
                  name: 'Mark Correct',
                  icon: 'done',
                  handler: () => {
                    console.log(this.props);
                    this.props.createOrganizationChangeRequest(
                      organization.id,
                      { verified_at: new Date().toISOString() },
                    );
                  },
                },
              ]}
              />
            </div>
          </div>

          {/* <div className="org--map">
            <ResourceMap
              name={name}
              lat={address.latitude}
              long={address.longitude}
              userLocation={this.props.userLocation}
            />
            <StreetViewImage address={address} name={name} />
          </div> */}
        </article>
      </div>
    );
  }
}

OrganizationPage.defaultProps = {
  userLocation: null,
};

OrganizationPage.propTypes = {
  // location: PropTypes.shape({
  //   query: PropTypes.shape({
  //     resourceid: PropTypes.string,
  //   }).isRequired,
  // }).isRequired,
  // userLocation is not required because will be lazy-loaded after initial render.
  // userLocation: PropTypes.shape({
  //   lat: PropTypes.number.isRequired,
  //   lng: PropTypes.number.isRequired,
  // }),
};

export default connect(
  state => ({ ...state.organizations }),
  dispatch => bindActionCreators({ fetchOrganization, createOrganizationChangeRequest }, dispatch),
)(OrganizationPage);
