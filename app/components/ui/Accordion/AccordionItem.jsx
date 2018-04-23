import React from 'react';
import PropTypes from 'prop-types';

// TODO Enforcing the user to add their own dropdown with a custom renderer is a bit clunky
class AccordionItem extends React.Component {
  render() {
    return (
      <div>
        <header>
          {
            this.props.headerRenderer()
              ? this.props.headerRenderer(this.props.title)
              : <div>
                { this.title }
                <div className="selector">
                  <i className="material-icons">keyboard_arrow_down</i>
                </div>
              </div>
          }
        </header>
        <section>{ this.props.children }</section>
      </div>
    );
  }
}

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  headerRenderer: PropTypes.func,
};

AccordionItem.defaultProps = {
  headerRenderer: () => null, // If undefined, we default to some basic template
};

export default AccordionItem;
