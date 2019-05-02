import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { images } from '../../assets';
import { RelativeOpeningTime } from '../listing/RelativeOpeningTime';

// TODO: create a shared component for Resource and Service entries
class ResourceEntry extends Component {
  render() {
    const {
      hit, index, page, hitsPerPage,
    } = this.props;
    const description = hit.long_description || 'No description, yet...';
    const hitNumber = page * hitsPerPage + index + 1;
    // const schedule = hit.schedule ? { schedule_days: hit.schedule } : null;
    // let timeInfo = null;

    return (
      <li className="results-table-entry resource-entry">
        <header>
          <div className="entry-details">
            <h4 className="entry-headline"><Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>{`${hitNumber}.) ${hit.name}`}</Link></h4>
            <div className="entry-subhead">
              <p>
                {hit.address && hit.address.address_1 ? hit.address.address_1 : 'No address found'}
                {/* { schedule ? ' • ' : null } */}
                {hit.schedule ? <span className="float-right"><RelativeOpeningTime schedule={{ schedule_days: hit.schedule }} /></span> : null}
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
        <div className="line-break" />
        <div className="entry-additional-info">
          <div className="entry-tabs">
            <p>Description</p>
          </div>
          <div className="entry-body">
            <ReactMarkdown className="rendered-markdown" source={description} />
          </div>
        </div>
        <div className="entry-action-buttons">
          <ul className="action-buttons">
            <li className="action-button"><Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>Details</Link></li>
            <li className="action-button">
              <a
                href={`https://maps.google.com?saddr=Current+Location&daddr=${hit._geoloc ? hit._geoloc.lat : 0},${hit._geoloc ? hit._geoloc.lng : 0}&dirflg=w`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions
              </a>
            </li>
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


export default connect(mapStateToProps)(ResourceEntry);
