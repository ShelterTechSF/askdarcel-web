import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class EditSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const resource = this.props.resource;
    let actionButtons = [
      <button
        className="edit--aside--content--button"
        key="submit"
        disabled={this.props.submitting}
        onClick={this.props.handleSubmit}
      >Save Changes</button>,
      <button
        className="edit--aside--content--button cancel--button"
        key="cancel"
        onClick={this.props.handleCancel}
      >Discard Changes</button>,
      <button
        className="edit--aside--content--button deactivate--button"
        key="deactive"
        disabled={this.props.submitting}
        onClick={() => this.props.handleDeactivation('resource', resource.id)}
      >Deactivate</button>,
    ];
    if (this.props.newResource) {
      actionButtons = [
        <button
          className="edit--aside--content--button"
          key="submit"
          disabled={this.props.submitting}
          onClick={this.props.createResource}
        >Submit</button>,
        <button
          className="edit--aside--content--button cancel--button"
          key="cancel"
          onClick={this.props.handleCancel}
        >Cancel</button>,
      ];
    }
    if (!resource.certified) {
      actionButtons.push(
        <button
          className="edit--aside--content--button hap--button"
          key="hap"
          onClick={this.props.certifyHAP}
        >HAP Approve</button>,
      );
    }
    return (
      <nav className="sidebar">
        <ul className="sidebar--org--info">
          <li className="sidebar--list--heading"><h3>Organization</h3></li>
          <li className="sidebar--organization--name">{resource.name}</li>
        </ul>
        <ul>
          <hr />
          <li className="sidebar--list--heading"><h3 className="sidebar--list--heading"><a href="#services">Services</a></h3></li>
          {Object.keys(this.props.newServices).reverse().map(service => (
            <li><a href={`#${service}`} style={{ display: 'block' }}>{this.props.newServices[service].name}</a></li>
          ))}
          { resource.services ? resource.services.map(service => (
            <li><a href={`#${service.id}`}>{service.name}</a></li>
          )) : null }
        </ul>
        <div className="button--group">
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
