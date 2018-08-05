import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { getTimes, timeToString } from '../../utils/index';
import { images } from '../../assets';
import RelativeOpeningTime from '../listing/RelativeOpeningTime';

// TODO: create a shared component for Resource and Service entries
class ServiceEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      openUntil: null,
    };

    this.getOpenInformation = this.getOpenInformation.bind(this);
  }

  componentDidMount() {
    this.getOpenInformation(this.props.hit.schedule);
  }

  getOpenInformation(scheduleDays) {
    const openInfo = getTimes(scheduleDays);
    this.setState({
      isOpen: openInfo.isOpen,
      openUntil: openInfo.openUntil,
      is24hour: openInfo.is24hour,
    });
  }

  render() {
    const { hit } = this.props;
    const { isOpen, openUntil, is24hour } = this.state;
    const description = hit.long_description || 'No description, yet...';
    const schedule = hit.schedule ? { schedule_days: hit.schedule } : null;
    let timeInfo = null;

    if (isOpen) {
      if (is24hour) {
        timeInfo = 'Open 24 hours';
      } else {
        timeInfo = `Open Until ${timeToString(openUntil)}`;
      }
    } else {
      timeInfo = 'Closed';
    }

    return (
      <li className="results-table-entry resource-entry">
        <header>
          <div className="entry-details">
            <h4 className="entry-headline">{hit.name}</h4>
            <div className="entry-subhead">
              <p>
                { hit.address && hit.address.address_1 ? hit.address.address_1 : 'No address found' }
                { hit.schedule ? ' • ' : null }
                { schedule ? <RelativeOpeningTime schedule={schedule} /> : null }
              </p>
            </div>
          </div>
          {hit.is_mohcd_funded ?
            <div className="mohcd-funded">
              <img src={images.mohcdSeal} alt="MOHCD seal" />
              <p>Funded by MOHCD</p>
            </div>
            :
            null
          }
        </header>
        <div className="line-break" />
        <div className="entry-additional-info">
          <div className="entry-tabs">
            <p>Description</p>
          </div>
          <div className="entry-body">
            <ReactMarkdown source={description} />
          </div>
        </div>
        <div className="entry-action-buttons">
          <ul className="action-buttons">
            <li className="action-button"><Link to={{ pathname: '/resource', query: { id: hit.resource_id } }}>Details</Link></li>
            <li className="action-button">
              <a
                href={`https://maps.google.com?saddr=Current+Location&daddr=${hit._geoloc.lat},${hit._geoloc.lng}&dirflg=w`}
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


export default connect(mapStateToProps)(ServiceEntry);
