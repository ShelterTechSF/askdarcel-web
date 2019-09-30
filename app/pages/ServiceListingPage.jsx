import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchService } from 'actions/serviceActions';

import { Datatable, Loader } from 'components/ui';
import { ServiceCard, ListingTitleLink } from 'components/layout';
import {
  ActionSidebar,
  ServiceAttribution,
  TableOfContactInfo,
  TableOfOpeningTimes,
  MobileActionBar,
} from 'components/listing';
import { MapOfLocations } from 'components/maps';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';
import 'react-tippy/dist/tippy.css';
import MOHCDBadge from 'components/listing/MOHCDBadge';
import { isSFServiceGuideSite } from '../utils/whitelabel';

// TODO This should be serviceAtLocation
const getServiceLocations = (service, resource, recurringSchedule) => (resource.address
  ? [resource.address].map(address => ({
    id: address.id,
    address,
    name: service.name,
    recurringSchedule,
    // Just to make it clear this is inherited from the resource
    inherited: !recurringSchedule && resource.schedule,
  }))
  : []);

class ServicePage extends React.Component {
  componentWillMount() {
    const {
      fetchService: propsFetchService,
      match: { params: { service } },
    } = this.props;
    propsFetchService(service);
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
      [
        'Notes',
        service.notes.map(d => d.note).join('\n'),
      ],
    ];
    return rows
      .filter(row => row[1])
      .map(row => ({
        title: row[0],
        value: <ReactMarkdown className="rendered-markdown">{ row[1] }</ReactMarkdown>,
      }));
  }


  render() {
    const { activeService: service } = this.props;
    if (!service) { return <Loader />; }

    const { resource, program, recurringSchedule } = service;
    const details = this.generateDetailsRows();
    const locations = getServiceLocations(service, resource, recurringSchedule);
    console.log(locations);
    return (
      <div>
        <Helmet>
          <title>
            { service.name }
              |
            { isSFServiceGuideSite() ? 'SF Service Guide' : 'AskDarcel' }
          </title>
          <meta name="description" content={service.long_description} />
        </Helmet>
        <div className="listing-container">
          <article className="listing" id="service">
            <div className="listing--main">
              <div className="listing--main--left">
                <header>
                  <div className="org--main--header--title-container">
                    <h1>{service.name}</h1>
                    <MOHCDBadge resource={resource} />
                  </div>
                  {service.alsoNamed ? <p>Also Known As</p> : null}
                  <p>
                    A service
                    {/* TODO Implement rendering/popover when programs exist */}
                    {program ? (
                      <span>
  in the
                        {program.name}
                        {' '}
  program,
                      </span>
                    ) : null}
                    <span>
                      {' '}
                      offered by
                      {' '}
                      <ListingTitleLink type="org" listing={resource} />
                    </span>
                  </p>
                </header>

                <MobileActionBar resource={resource} service={service} />

                <section className="listing--main--left--about">
                  <h2>About This Service</h2>
                  <ReactMarkdown className="rendered-markdown" source={service.long_description} />
                  <ServiceAttribution
                    attribution={resource.source_attribution}
                    status={resource.status}
                  />
                </section>

                {details.length ? (
                  <section className="listing--main--left--details">
                    <h2>Service Details</h2>
                    <Datatable
                      rowRenderer={d => (
                        <tr key={d.title}>
                          <th>{d.title}</th>
                          <td>
                            {Array.isArray(d.value)
                              ? d.value.join('\n')
                              : d.value}
                          </td>
                        </tr>
                      )}
                      rows={details}
                    />
                  </section>
                ) : null}

                <section className="listing--main--left--contact">
                  <h2>Contact Info</h2>
                  <TableOfContactInfo item={service} />
                </section>

                <section className="listing--main--left--hours">
                  <h2>Locations and Hours</h2>
                  <MapOfLocations
                    locations={locations}
                    locationRenderer={location => (
                      <TableOfOpeningTimes
                        recurringSchedule={location.recurringSchedule}
                      />
                    )}
                  />
                  {/* TODO Transport Options */}
                </section>

                {resource.services.length > 1 ? (
                  <section>
                    <h2>Other Services at this Location</h2>
                    {resource.services
                      .filter(srv => srv.id !== service.id)
                      .map(srv => (
                        <ServiceCard service={srv} key={srv.id} />
                      ))}
                  </section>
                ) : null}

                {/* TODO Need an API to get similar services, maybe same category for now? */}
                {/* <section>
                  <h2>Similar Services Near You</h2>
                </section> */}
              </div>
              <div className="listing--aside">
                <ActionSidebar resource={resource} service={service} />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }
}

ServicePage.propTypes = {
  match: PropTypes.object.isRequired,
};

export const ServiceListingPage = connect(
  state => ({ ...state.services }),
  dispatch => bindActionCreators({ fetchService }, dispatch),
)(ServicePage);
