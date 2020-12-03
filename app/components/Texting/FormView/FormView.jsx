import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from './config';
import Heading from './components/Heading';
import Privacy from './components/Privacy';
import Buttons from './components/Buttons';
import RenderInputs from './components/RenderInputs';

const initialState = {
  user_name: '',
  phone_number: '',
  agreed: false,
};

const FormView = ({ resource, handleSubmit, toggle }) => {
  const [state, setState] = useState(initialState);
  const { user_name, phone_number, agreed } = state;

  const buttonDisabled = () => !(agreed && /^\(?(\d{3})\)?[-. ]?(\d{3})[- . ]?(\d{4})$/.test(phone_number));

  const onChange = name => event => {
    const { type, value, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setState(prevState => ({ ...prevState, [name]: newValue }));
  };

  const config = useMemo(() => getConfig({ state, onChange }), [state]);

  const onSubmit = event => {
    event.preventDefault();
    const data = {
      user_name,
      phone_number,
      resource_id: resource.id,
    };
    handleSubmit(data);
  };

  return (
    <Fragment>
      <Heading resource_name={resource.name} />
      <RenderInputs config={config} />
      <Buttons disabled={buttonDisabled()} toggle={toggle} onSubmit={onSubmit} />
      <Privacy />
    </Fragment>
  );
};

FormView.propTypes = {
  resource: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default FormView;
