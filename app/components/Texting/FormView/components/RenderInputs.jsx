import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const mapPropsToConfig = config => {
  const configWithProps = [];

  config.forEach(item => {
    const { component, ...props } = item;
    configWithProps.push({
      ...props,
      Component: component,
    });
  });

  return configWithProps;
};

const RenderInputs = ({ config }) => {
  const configWithProps = mapPropsToConfig(config);

  const renderComponents = items => items.map(item => {
    const { Component, ...props } = item;
    return (
      <Fragment key={props.name}>
        <Component {...props} />
      </Fragment>
    );
  });

  return renderComponents(configWithProps);
};

RenderInputs.propTypes = {
  config: PropTypes.array.isRequired,
};

export default RenderInputs;
