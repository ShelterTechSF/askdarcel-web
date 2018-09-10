import React from 'react';
import PropTypes from 'prop-types';

import './accordion.scss';

class Accordion extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      activeTab: 0,
    };
  }

  setTab(i) {
    this.setState({ activeTab: i });
  }

  render() {
    const { activeTab } = this.state

    return (
      <ul className="accordion">
        {
          this.props.children.map((ch, i) => (
            <li
              className={activeTab === i ? 'open' : 'closed'}
              onClick={() => this.setTab(i)}
              key={i}
            >
              { ch }
            </li>
          ))
        }
      </ul>
    );
  }
}

export default Accordion;
