import React from 'react';

import './accordion.scss';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.children[0].key,
    };
  }

  setTab(i) {
    this.setState({ activeTab: i });
  }

  render() {
    const { children } = this.props;
    const { activeTab } = this.state;

    return (
      <ul className="accordion">
        {
          children.map(ch => (
            <li // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
              className={activeTab === ch.key ? 'open' : 'closed'}
              onClick={() => this.setTab(ch.key)}
              key={ch.key}
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
