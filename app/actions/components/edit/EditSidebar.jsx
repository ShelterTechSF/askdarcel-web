import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import './EditSidebar.scss';

class EditSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const resource = this.props.resource;
    let actionButtons = [
      <button
        className="sidebar--actions--button"
        key="submit"
        disabled={this.props.submitting}
        onClick={this.props.handleSubmit}
      >Save Changes</button>,
      <button
        className="sidebar--actions--button deactivate"
        key="deactive"
        disabled={this.props.submitting}
        onClick={() => this.props.handleDeactivation('resource', resource.id)}
      >Deactivate</button>,
    ];
    if (this.props.newResource) {
      actionButtons = [
        <button
          className="sidebar--actions--button"
          key="submit"
          disabled={this.props.submitting}
          onClick={this.props.createResource}
        >Submit</button>,
        <button
          className="sidebar--actions--button cancel"
          key="cancel"
          onClick={this.props.handleCancel}
        >Cancel</button>,
      ];
    }
    if (!resource.certified) {
      actionButtons.push(
        <button
          className="sidebar--actions--button hap--button"
          key="hap"
          onClick={this.props.certifyHAP}
        >HAP Approve</button>,
      );
    }
    return (
      <nav className="sidebar">
        <div className="sidebar--content">
          <ul className="sidebar--list">
            <li className="sidebar--list--heading">
              <h3>Organization</h3>
            </li>
            <li className="sidebar--list--item active">
              <a href="#">{resource.name}</a>
            </li>
          </ul>
          <ul className="sidebar--list">
            <li className="sidebar--list--heading">
              <h3><a href="#services">Services</a></h3>
            </li>
            {Object.keys(this.props.newServices).reverse().map(service => (
              <li className="sidebar--list--item">
                <a href={`#${service}`} style={{ display: 'block' }}>{this.props.newServices[service].name}</a>
              </li>
            ))}
            { resource.services ? resource.services.map(service => (
              <li className="sidebar--list--item">
                <a href={`#${service.id}`}>{service.name}</a>
              </li>
            )) : null }
          </ul>
        </div>
        <div className="sidebar--actions">
          {actionButtons.map(button => button)}
        </div>
      </nav>
    );
  }
}

EditSidebar.defaultProps = {
  newServices: {},
};

EditSidebar.propTypes = {
  certifyHAP: PropTypes.func,
  createResource: PropTypes.func,
  handleDeactivation: PropTypes.func,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
  newResource: PropTypes.bool,
  newServices: PropTypes.object,
  resource: PropTypes.object,
  submitting: PropTypes.bool,
};

export default withRouter(EditSidebar);
