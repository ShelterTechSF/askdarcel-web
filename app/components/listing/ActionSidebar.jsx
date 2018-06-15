import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

class ListPageSidebar extends React.Component {
  renderButtonContent(action) {
    return (
      <span>
        <i className="material-icons">{ action.icon }</i>
        { action.name }
      </span>
    );
  }

  render() {
    return (
      <ul className="actions">
        {this.props.actions.map(action => (
          <li key={action.name}>
            {
              action.to || action.handler
                ? <Link to={action.to} onClick={action.handler} className={`listing--aside--${action.name.toLowerCase()}`}>
                  { this.renderButtonContent(action) }
                </Link>
                : <a href={action.link} target="_blank" className={`listing--aside--${action.name.toLowerCase()}`}>
                  { this.renderButtonContent(action) }
                </a>
            }
          </li>
        ))}
      </ul>
    );
  }
}

ListPageSidebar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string,
    to: PropTypes.string,
    handler: PropTypes.function,
  })).isRequired,
};

export default ListPageSidebar;
