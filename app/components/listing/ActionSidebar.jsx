import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { getResourceActions } from 'utils/ResourceActions';
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
  return sidebarActions;
};

const renderButtonContent = action => (
  <Fragment>
    <img
      className="action-sidebar--icon"
      src={images.icon(`${action.icon}-gray`)}
      alt={action.icon}
    />
    <span>{ action.name }</span>
  </Fragment>
);

class ListPageSidebar extends React.Component {
  render() {
    const { resource, service } = this.props;
    const actions = getSidebarActions(resource, service);

    return (
      <ul className="action-sidebar">
        {actions.map(action => (
          <li key={action.name}>
            {
              action.to || action.handler
                ? (
                  <Link to={action.to} onClick={action.handler} className={`action-sidebar--${action.name.toLowerCase()}`}>
                    { renderButtonContent(action) }
                  </Link>
                )
                : (
                  <a href={action.link} rel="noopener noreferrer" target="_blank" className={`action-sidebar--${action.name.toLowerCase()}`}>
                    { renderButtonContent(action) }
                  </a>
                )
            }
          </li>
        ))}
      </ul>
    );
  }
}

ListPageSidebar.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default ListPageSidebar;
