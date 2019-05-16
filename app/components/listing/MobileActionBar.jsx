import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import { getResourceActions } from 'utils/ResourceActions';
import { images } from '../../assets';

import './MobileActionBar.scss';

const getMobileActions = resource => {
  const resourceActions = getResourceActions(resource);

  const mobileActions = [
    { ...resourceActions.edit, icon: 'edit-blue' },
  ];
  if (resourceActions.directions) {
    mobileActions.unshift({ ...resourceActions.directions, icon: 'directions-blue' });
  }
  if (resourceActions.phone) {
    mobileActions.unshift({ ...resourceActions.phone, icon: 'phone-blue' });
  }
  return mobileActions;
};

const renderButtonContent = action => (
  <div key={action.name} className="mobile-action-bar--button-content">
    <img
      src={images.icon(action.icon)}
      alt={action.icon}
      className="mobile-action-bar--button-icon"
    />
    <span>{action.name}</span>
  </div>
);

export default class MobileActionBar extends React.Component {
  render() {
    const { resource } = this.props;
    const actions = getMobileActions(resource);
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
                  <a href={action.link} target="_blank" rel="noopener noreferrer">
                    {renderButtonContent(action)}
                  </a>
                )
            }
          </div>
        ))}
      </div>
    );
  }
}

MobileActionBar.propTypes = {
  resource: PropTypes.object.isRequired,
};
