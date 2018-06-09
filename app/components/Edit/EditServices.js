import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createTemplateSchedule } from '../../utils/index';
import ProvidedService from './ProvidedService';

class EditServices extends Component {
  constructor(props) {
    super(props);

    const { services } = props;
    const existingServices = services ?
      services.map((service) => {
        service.key = service.id;
        return service;
      }) : [];

    this.state = {
      services: {},
      existingServices,
      uuid: -1,
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.addService = this.addService.bind(this);
  }

  /* @method handleServiceChange
   * @description Updates the service with any changes made
   * @param {string} key a unique identifier to find a service
   * @param {object} service the service to be updated
   * @returns {void}
   */
  handleServiceChange(key, service) {
    const services = this.state.services;
    services[key] = service;
    this.setState({
      services,
    }, () => {
      this.props.handleServiceChange(this.state);
    });
  }

  /* @method addService
   * @description Creates a brand new service
   */
  addService() {
    const { existingServices } = this.state,
      newUUID = this.state.uuid - 1;

    existingServices.unshift({
      id: newUUID,
      key: newUUID,
      notes: [],
      schedule: {
        schedule_days: createTemplateSchedule(),
      },
    });
    this.setState({
      existingServices,
      uuid: newUUID,
    });
  }

  render() {
    return (
      <li className="edit--section--list--item">
        <button
          className="edit--section--list--item--button"
          onClick={this.addService}
        >
          <i className="material-icons">add_box</i>
          Add Service
        </button>
        <ul className="edit--section--list--item--sublist edit--service--list">
          {
            this.state.existingServices.map((service, index) => (
              <ProvidedService
                key={service.key}
                index={index}
                service={service}
                handleChange={this.handleServiceChange}
                handleDeactivation={this.props.handleDeactivation}
              />
            ))
          }
        </ul>
      </li>
    );
  }
}

EditServices.propTypes = {
  handleDeactivation: PropTypes.func,
  handleServiceChange: PropTypes.func,
};

export default EditServices;
