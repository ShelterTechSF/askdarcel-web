import React from 'react';
import PropTypes from 'prop-types';

// TODO Enforcing the user to add their own dropdown with a custom renderer is a bit clunky
const AccordionItem = ({ children, headerRenderer, title }) => (
  <div>
    <header>
      {headerRenderer(title)}
    </header>
    <section>{ children }</section>
  </div>
);

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  headerRenderer: PropTypes.func,
  children: PropTypes.node.isRequired,
};

AccordionItem.defaultProps = {
  headerRenderer: title => title,
};

export default AccordionItem;
