import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { images } from '../../assets';
import { RelativeOpeningTime } from '../listing/RelativeOpeningTime';
import './SearchEntry.scss';

// TODO: create a shared component for Resource and Service entries
class ServiceEntry extends Component {
  render() {
    const {
      hit, index, page, hitsPerPage,
    } = this.props;
    const description = hit.long_description || 'No description, yet...';
    const schedule = hit.schedule && hit.schedule.length
      ? { schedule_days: hit.schedule } : { schedule_days: hit.resource_schedule };
    const hitNumber = page * hitsPerPage + index + 1;
    return (
      <Link to={{ pathname: `/services/${hit.service_id}` }}>
        <li className="results-table-entry service-entry">
          <div className="entry-details">
            <h4 className="entry-headline">{`${hitNumber}. ${hit.name}`}</h4>
            <p className="entry-meta">
              <Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>{hit.service_of}</Link>
            </p>
            <p className="entry-meta">
              <span>{hit.addresses && hit.addresses.address_1 ? hit.addresses.address_1 : 'No address found'}</span>
              {schedule ? (
                <span className="entry-schedule">
                  <RelativeOpeningTime schedule={schedule} />
                </span>
              ) : null}
            </p>

            {hit.is_mohcd_funded
              ? (
                <div className="mohcd-funded">
                  <img src={images.mohcdSeal} alt="MOHCD seal" />
                  <p>Funded by MOHCD</p>
                </div>
              )
              : null
            }
            <div className="entry-body">
              <ReactMarkdown className="rendered-markdown service-entry-body" source={description} />
            </div>
          </div>

          <ul className="action-buttons">
            {hit._geoloc && (
              <li className="action-button">
                <a
                  href={`http://google.com/maps/dir/?api=1&destination=${hit._geoloc.lat},${hit._geoloc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="material-icons">directions_outlined</i>
                  Go
                </a>
              </li>
            )}
          </ul>

        </li>
      </Link>
    );
  }
}


function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

export default connect(mapStateToProps)(ServiceEntry);
