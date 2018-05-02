import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchService } from 'actions/serviceActions';

import { Datatable, Loader } from 'components/ui';
import { ServiceCard, ListingTitleLink } from 'components/layout';
import { ActionSidebar, TableOfContactInfo, TableOfOpeningTimes, CategoryTag } from 'components/listing';
import { MapOfLocations } from 'components/maps';

import 'react-tippy/dist/tippy.css';

class ServicePage extends React.Component {
  componentWillMount() {
    const { routeParams: { service } } = this.props;
    this.props.fetchService(service);
  }

  generateDetailsRows() {
    const { activeService: service } = this.props;
    const rows = [
      ['How to Apply', service.application_process],
      ['Who Can Use This', service.eligibility],
      ['Required Documents', service.required_documents],
      ['Fees', service.fee],
      // ['Waitlist', ] // TODO This doesn't exist in any services
      // ['Accessibility', ] // TODO Doesn't exist
      // ['Languages'] // TODO Doesn't exist
      // ['Funding Sources', ] // TODO Doesn't exist
      ['Notes', service.notes.map(d => d.note).join('\n')],
    ];
    return rows
      .filter(row => row[1])
      .map(row => ({ title: row[0], value: row[1] }));
  }

  render() {
    const { activeService: service } = this.props;
    if (!service) { return (<Loader />); }

    const { resource, program, schedule } = service;
    const details = this.generateDetailsRows();

    // TODO This should be serviceAtLocation
    const locations = [
      resource.address,
    ].map(address => ({
      id: address.id,
      address,
      name: service.name,
      schedule,
    }));

    return (
      <div className="listing-container">
        <article className="listing" id="service">
          <div className="listing--main">
            <div className="listing--main--left">
              <header>
                <h1>{ service.name }</h1>
                { service.alsoNamed ? <p>Also Known As</p> : null}
                <p>
                  A service
                  {/* TODO Implement rendering/popover when programs exist */}
                  { program ? <span>in the {program.name} program,</span> : null }
                  <span> offered by <ListingTitleLink type="org" listing={resource} /></span>
                </p>
              </header>

              <section>
                <h2>About This Service</h2>
                <p>{ service.long_description }</p>
              </section>

              { details.length ? <section>
                <h2>Service Details</h2>
                <Datatable
                  rowRenderer={d => (
                    <tr key={d.title}>
                      <th>{ d.title }</th>
                      <td>{ Array.isArray(d.value) ? d.value.join('\n') : d.value }</td>
                    </tr>
                  )}
                  rows={this.generateDetailsRows()}
                />
              </section> : null}

              <section>
                <h2>Contact Info</h2>
                <TableOfContactInfo item={service} />
              </section>

              <section>
                <h2>Locations and Hours</h2>
                <MapOfLocations
                  locations={locations}
                  locationRenderer={location => (
                    <TableOfOpeningTimes schedule={location.schedule} />
                  )}
                />
                {/* TODO Transport Options */}
              </section>

              { resource.services.length > 1 ? <section>
                <h2>Other Services at this Location</h2>
                {/* TODO Exclude the current service from this list */}
                { resource.services.map(srv => (<ServiceCard service={srv} key={srv.id} />)) }
              </section> : null}

              {/* TODO Need an API to get similar services, maybe same category for now? */}
              {/* <section>
                <h2>Similar Services Near You</h2>
              </section> */}

            </div>
            <div className="listing--aside">
              <ActionSidebar actions={[
                // TODO Edit should add service ID header
                { name: 'Edit', icon: 'edit', to: `/resource/edit?resourceid=${resource.id}` }, // TODO Update with path to /resource/:id
                { name: 'Print', icon: 'print', handler: () => { window.print(); } },
                // TODO Integrate with mobile share, how to handle shares
                // { name: 'Share', icon: 'share' },
                // { name: 'Save', icon: 'save' }, TODO We have no save mechanism yet
                // TODO Directions to address, not lat/long, is much better UX
                { name: 'Directions', icon: 'directions', link: `http://google.com/maps/dir/?api=1&destination=${resource.address.latitude},${resource.address.longitude}` },
              ]}
              />

              { service.categories.map(cat => (<CategoryTag key={cat.id} category={cat} />)) }
            </div>
          </div>
        </article>
      </div>
    );
  }
}

ServicePage.propTypes = {
  routeParams: PropTypes.object.isRequired,
};

export default connect(
  state => ({ ...state.services }),
  dispatch => bindActionCreators({ fetchService }, dispatch),
)(ServicePage);
