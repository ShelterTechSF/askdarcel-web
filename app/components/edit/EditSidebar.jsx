import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import styles from './EditSidebar.module.scss';

function SaveButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      className={styles.actionButton}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function EditSidebar({
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
}) {
  let actionButtons = [
    <SaveButton
      key="submit"
      disabled={submitting}
      onClick={handleSubmit}
    >
      Save Changes
    </SaveButton>,
    <button
      type="button"
      className={`${styles.actionButton} ${styles.deactivate}`}
      key="deactive"
      disabled={submitting}
      onClick={() => handleDeactivation('resource', resource.id)}
    >
      Deactivate
    </button>,
  ];
  if (newResource) {
    actionButtons = [
      <SaveButton
        key="submit"
        disabled={submitting}
        onClick={createResource}
      >
        Submit
      </SaveButton>,
      <button
        type="button"
        className={`${styles.actionButton} ${styles.cancel}`}
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
        className={styles.actionButton}
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
    (acc, [id, service]) => ({ ...acc, [id]: { ...service } }),
    {},
  );
  if (resource.services) {
    resource.services.forEach(service => {
      allServices[service.id].name = service.name;
    });
  }
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h3 className={styles.listHeading}>Organization</h3>
        <ul className={styles.list}>
          <li className={`${styles.listItem} ${styles.active}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#">{resource.name}</a>
          </li>
        </ul>

        <h3 className={styles.listHeading}>
          <a href="#services">Services</a>
          <button type="button" className={styles.serviceActionButton} onClick={addService}>
            <i className="material-icons">add_circle_outline</i>
          </button>
        </h3>
        <ul className={styles.list}>
          {Object.entries(allServices).map(([key, service]) => (
            <li key={key} className={styles.listItem}>
              <a
                href={`#${key}`}
                style={{ display: 'block' }}
                onClick={e => {
                  e.preventDefault();
                  const topOfElement = document.getElementById(key).offsetTop;
                  window.scroll({ top: topOfElement, behavior: 'smooth' });
                }}
              >
                {service.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        {actionButtons}
      </div>
    </nav>
  );
}

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
