import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTimes, timeToString } from '../../utils/index';

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
    });
  }

  render() {
    const { hit } = this.props;
    const { isOpen, openUntil } = this.state;
    const description = hit.long_description || 'No description, yet...';
    let timeInfo = null;
    if (isOpen) {
      timeInfo = `Open Until ${timeToString(openUntil)}`;
    } else {
      timeInfo = 'Closed';
    }

    return (
      <li className="results-table-entry resource-entry">
        <header>
          <div className="entry-details">
            <h4 className="entry-headline">{hit.name}</h4>
            <div className="entry-subhead">
              <p>{`${hit.address.address_1} • ${timeInfo}`}</p>
            </div>
          </div>
        </header>
        <div className="line-break" />
        <div className="entry-additional-info">
          <div className="entry-tabs">
            <p>Description</p>
          </div>
          <div className="entry-body">
            <p>{description}</p>
          </div>
        </div>
        <div className="entry-action-buttons">
          <ul className="action-buttons">
            <li className="action-button">Details</li>
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
