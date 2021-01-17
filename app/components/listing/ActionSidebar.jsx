import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { Link } from 'react-router-dom';
import { getResourceActions } from 'utils/ResourceActions';
import FeedbackModal from './feedback/FeedbackModal';
import { images } from '../../assets';

import './ActionSidebar.scss';

const getSidebarActions = (resource, service) => {
  const resourceActions = getResourceActions(resource, service);
  const sidebarActions = [
    resourceActions.print,
    resourceActions.verify,
  ];
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
      src={images.icon(`${action.icon}-gray`)}
      alt={action.icon}
    />
    <span>{action.name}</span>
  </Fragment>
);

const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);

class ListPageSidebar extends React.Component {
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
    const actions = getSidebarActions(resource, service);
    const { isModalOpen } = this.state;

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
                  action.feedback ? this.toggleModalOpen() : action.handler()
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
        </li>
      </ul>
    );
  }
}

ListPageSidebar.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default ListPageSidebar;
