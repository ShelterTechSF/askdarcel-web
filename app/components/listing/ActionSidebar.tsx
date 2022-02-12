import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { icon } from '../../assets';
import { getResourceActions } from '../../utils/ResourceActions';
import { Organization, Service } from '../../models';
import FeedbackModal from './feedback/FeedbackModal';

import './ActionSidebar.scss';

const getSidebarActions = (organization: Organization, service?: Service) => {
  const resourceActions = getResourceActions(organization, service);
  const sidebarActions = [resourceActions.print];
  if (resourceActions.directions) {
    sidebarActions.push(resourceActions.directions);
  }
  // added feedback action here to make sure it appears last in the sidebar
  sidebarActions.push(resourceActions.feedback);
  return sidebarActions;
};

const renderButtonContent = action => (
  <Fragment>
    <img
      className="action-sidebar--icon"
      src={icon(`${action.icon}-gray`)}
      alt={action.icon}
    />
    <span>{action.name}</span>
  </Fragment>
);

export const ActionSidebar = ({ organization, service }: { organization: Organization; service?: Service }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actions = getSidebarActions(organization, service);

  return (
    <ul className="action-sidebar">
      {actions.map(action => (
        <li key={action.name}>
          {action.to ? (
            <Link
              to={action.to}
              onClick={action.handler}
              className={`action-sidebar--${action.name.toLowerCase()}`}
            >
              {renderButtonContent(action)}
            </Link>
          ) : (
            <a
              href={action.link}
              onClick={() => (
                action.feedback ? setIsOpen(!isOpen) : action.handler()
              )}
              rel="noopener noreferrer"
              target="_blank"
              className={`action-sidebar--${action.name.toLowerCase()}`}
            >
              {renderButtonContent(action)}
            </a>
          )}
        </li>
      ))}
      <li className="feedback-modal">
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
      </li>
    </ul>
  );
};
