import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import { images } from '../../assets';

const renderButtonContent = action => (
  <div key={action.name} className="listing-menu--button-content">
    <img
      src={images.icon(action.icon)}
      alt={action.icon}
      className="listing-menu--button-icon"
    />
    <span>{action.name}</span>
  </div>
);

export default class MobileActionBar extends React.Component {
  render() {
    const { actions } = this.props;

    return (
      <div className="listing-menu">
        {actions.map(action => (
          <div key={action.name} className="listing-menu--button">
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
  actions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string,
    to: PropTypes.string,
    handler: PropTypes.function,
  })).isRequired,
};
