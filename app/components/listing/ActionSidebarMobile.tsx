import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { icon } from '../../assets';
import { Organization, Service } from '../../models';
import { getResourceActions } from '../../utils/ResourceActions';
import FeedbackModal from './feedback/FeedbackModal';

import './ActionSidebarMobile.scss';

const getMobileActions = (organization: Organization, service?: Service) => {
  const resourceActions = getResourceActions(organization, service);

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

export const ActionSidebarMobile = ({ organization, service }: { organization: Organization; service?: Service }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actions = getMobileActions(organization, service);

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
                    action.feedback ? setIsOpen(!isOpen) : action.handler()
                  )}
                >
                  {renderButtonContent(action)}
                </a>
              )
          }
        </div>
      ))}
      <Modal
        isOpen={isOpen}
        className="feedback__Modal"
        overlayClassName="feedback__Overlay"
      >
        <FeedbackModal
          closeModal={() => setIsOpen(!isOpen)}
          resource={organization}
          service={service}
        />
      </Modal>
    </div>
  );
};
