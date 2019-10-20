import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { images } from '../../assets';
import { RelativeOpeningTime } from '../listing/RelativeOpeningTime';
import './SearchEntry.scss';

class SearchEntry extends Component {
  render() {
    const {
      hit, index, page, hitsPerPage,
    } = this.props;
    const description = hit.long_description || 'No description, yet...';
    const hitNumber = page * hitsPerPage + index + 1;
    const { recurringSchedule, type } = hit;

    // handle resources and services slightly differently.
    let basePath = 'organizations';
    let entryId = hit.resource_id;
    if (type === 'service') {
      basePath = 'services';
      entryId = hit.service_id;
    }
    return (
      <Link to={{ pathname: `/${basePath}/${entryId}` }}>
        <li className={`results-table-entry ${type}-entry`}>
          <div className="entry-details">
            <div className="entry-header">
              <h4 className="entry-headline">{`${hitNumber}. ${hit.name}`}</h4>
              {hit.is_mohcd_funded && (
              <div className="mohcd-funded">
                <img src={images.mohcdSeal} alt="MOHCD seal" />
                <p>Funded by MOHCD</p>
              </div>
              )
              }
            </div>
            {type === 'service' && (
            <p className="entry-meta">
              <Link to={`/organizations/${hit.resource_id}`}>{hit.service_of}</Link>
            </p>
            )}
            <p className="entry-meta">
              {type === 'service' && (
                <span>{hit.addresses && hit.addresses.address_1 ? hit.addresses.address_1 : 'No address found'}</span>
              )}
              {type === 'resource' && (
                <span>{hit.address && hit.address.address_1 ? hit.address.address_1 : 'No address found'}</span>
              )}
              {recurringSchedule
                  && (
                    <span className="entry-schedule">
                      <RelativeOpeningTime recurringSchedule={recurringSchedule} />
                    </span>
                  )
              }
            </p>
            <div className="entry-body">
              <ReactMarkdown className="rendered-markdown search-entry-body" source={description} />
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


export default connect(mapStateToProps)(SearchEntry);
