import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { icon } from 'assets';
import { getResourceActions } from 'utils/ResourceActions';
import FeedbackModal from './feedback/FeedbackModal';


import './MobileActionBar.scss';

const getMobileActions = (resource, service) => {
  const resourceActions = getResourceActions(resource, service);

  const mobileActions = [];
  if (resourceActions.phone) {
    mobileActions.push(resourceActions.phone);
  }
  if (resourceActions.directions) {
    mobileActions.push(resourceActions.directions);
  }
  mobileActions.push(resourceActions.feedback);
  return mobileActions;
};

const renderButtonContent = action => (
  <div key={action.name} className="mobile-action-bar--button-content">
    <img
      src={icon(`${action.icon}-blue`)}
      alt={action.icon}
      className="mobile-action-bar--button-icon"
    />
    <span>{action.name}</span>
  </div>
);

export default class MobileActionBar extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalOpen: false,
    };
  }

  toggleModalOpen = () => {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  render() {
    const { resource, service } = this.props;
    const actions = getMobileActions(resource, service);
    const { isModalOpen } = this.state;
    return (
      <div className="mobile-action-bar">
        {actions.map(action => (
          <div key={action.name} className="mobile-action-bar--button">
            {
              action.to || action.handler
                ? (
                  <Link to={action.to} onClick={action.handler}>
                    {renderButtonContent(action)}
                  </Link>
                )
                : (
                  <a
                    href={action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => (
                      action.feedback ? this.toggleModalOpen() : action.handler()
                    )}
                  >
                    {renderButtonContent(action)}
                  </a>
                )
            }
          </div>
        ))}
        <Modal
          isOpen={isModalOpen}
          className="feedback__Modal"
          overlayClassName="feedback__Overlay"
        >
          <FeedbackModal
            closeModal={this.toggleModalOpen}
            resource={resource}
            service={service}
          />
        </Modal>
      </div>
    );
  }
}

MobileActionBar.propTypes = {
  resource: PropTypes.object.isRequired,
};
