import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { images } from '../../assets';
import { RelativeOpeningTime } from '../listing/RelativeOpeningTime';

// TODO: create a shared component for Resource and Service entries
class ServiceEntry extends Component {
  render() {
    const {
      hit, index, page, hitsPerPage,
    } = this.props;
    const description = hit.long_description || 'No description, yet...';
    const hitNumber = page * hitsPerPage + index + 1;
    const { recurringSchedule } = hit;
    return (
      <li className="results-table-entry service-entry">
        <header>
          <div className="entry-details">
            <h4 className="entry-headline"><Link to={{ pathname: `/services/${hit.service_id}` }}>{`${hitNumber}) ${hit.name}`}</Link></h4>
            <div className="entry-subhead">
              <p className="entry-affiliated-resource">
                a service offered by&nbsp;
                <Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>{hit.service_of}</Link>
              </p>
              <p>
                {hit.addresses && hit.addresses.address_1 ? hit.addresses.address_1 : 'No address found'}
                {recurringSchedule
                    && (
                      <span className="float-right">
                        <RelativeOpeningTime recurringSchedule={recurringSchedule} />
                      </span>
                    )
                }
              </p>
            </div>
          </div>
          {hit.is_mohcd_funded
            ? (
              <div className="mohcd-funded">
                <img src={images.mohcdSeal} alt="MOHCD seal" />
                <p>Funded by MOHCD</p>
              </div>
            )
            : null
          }
        </header>

        <div className="service-entry-additional-info">
          <ReactMarkdown className="rendered-markdown service-entry-body" source={description} />
        </div>

        <div className="entry-action-buttons">
          <ul className="action-buttons">
            <li className="action-button"><Link to={{ pathname: `/services/${hit.service_id}` }}>Details</Link></li>
            {hit._geoloc && (
              <li className="action-button">
                <a
                  href={`http://google.com/maps/dir/?api=1&destination=${hit._geoloc.lat},${hit._geoloc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Directions
                </a>
              </li>
            )}
          </ul>
        </div>

      </li>
    );
  }
}


function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}

export default connect(mapStateToProps)(ServiceEntry);
