import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import './EditSidebar.scss';

const EditSidebar = ({
  addService,
  certifyHAP,
  createResource,
  handleCancel,
  handleDeactivation,
  handleSubmit,
  newResource,
  newServices,
  resource,
  submitting,
}) => {
  let actionButtons = [
    <button
      type="button"
      className="sidebar--actions--button"
      key="submit"
      disabled={submitting}
      onClick={handleSubmit}
    >
      Save Changes
    </button>,
    <button
      type="button"
      className="sidebar--actions--button deactivate"
      key="deactive"
      disabled={submitting}
      onClick={() => handleDeactivation('resource', resource.id)}
    >
      Deactivate
    </button>,
  ];
  if (newResource) {
    actionButtons = [
      <button
        type="button"
        className="sidebar--actions--button"
        key="submit"
        disabled={submitting}
        onClick={createResource}
      >
        Submit
      </button>,
      <button
        type="button"
        className="sidebar--actions--button cancel"
        key="cancel"
        onClick={handleCancel}
      >
        Cancel
      </button>,
    ];
  }
  if (!resource.certified) {
    actionButtons.push(
      <button
        type="button"
        className="sidebar--actions--button hap--button"
        key="hap"
        onClick={certifyHAP}
      >
        HAP Approve
      </button>,
    );
  }
  // Populate existing services so they show up on the sidebar
  // Do a 2-level-deep clone of the newServices object
  const allServices = Object.entries(newServices).reduce(
    (acc, [id, service]) => ({...acc, [id]: {...service}}),
    {},
  );
  if (resource.services) {
    resource.services.forEach(service => {
      allServices[service.id].name = service.name;
    });
  }
  return (
    <nav className="sidebar">
      <div className="sidebar--content">
        <ul className="sidebar--list">
          <li className="sidebar--list--heading">
            <h3>Organization</h3>
          </li>
          <li className="sidebar--list--item active">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#">{resource.name}</a>
          </li>
        </ul>
        <ul className="sidebar--list">
          <li className="sidebar--list--heading">
            <h3>
              <a href="#services">Services</a>
              <button type="button" className="service--action--button" onClick={addService}><i className="material-icons">add</i></button>
            </h3>
          </li>
          {Object.keys(allServices).map(service => (
            <li key={service} className="sidebar--list--item">
              <a href={`#${service}`} style={{ display: 'block' }}>{allServices[service].name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar--actions">
        {actionButtons.map(button => button)}
      </div>
    </nav>
  );
};

EditSidebar.defaultProps = {
  newServices: {},
};

EditSidebar.propTypes = {
  certifyHAP: PropTypes.func.isRequired,
  createResource: PropTypes.func.isRequired,
  handleDeactivation: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  newResource: PropTypes.bool.isRequired,
  newServices: PropTypes.object,
  resource: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default withRouter(EditSidebar);
