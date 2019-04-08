import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createTemplateSchedule } from '../../utils/index';
import ProvidedService from './ProvidedService';

class EditServices extends Component {
  constructor(props) {
    super(props);

    const { services } = props;
    const existingServices = services
      ? services.map(service => {
        /* eslint-disable no-param-reassign */
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
    const { handleServiceChange } = this.props;
    const { services } = this.state;
    services[key] = service;
    this.setState({
      services,
    }, () => {
      handleServiceChange(this.state);
    });
  }

  /* @method addService
   * @description Creates a brand new service
   */
  addService() {
    const { existingServices, uuid } = this.state;
    const newUUID = uuid - 1;

    existingServices.push({
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
    const { handleDeactivation } = this.props;
    const { existingServices } = this.state;
    return (
      <li className="edit--section--list--item">
        <ul className="edit--section--list--item--sublist edit--service--list">
          {
            existingServices.map((service, index) => (
              <ProvidedService
                key={service.key}
                index={index}
                service={service}
                handleChange={this.handleServiceChange}
                handleDeactivation={handleDeactivation}
              />
            ))
          }
        </ul>
        <button
          type="button"
          className="edit--section--list--item--button new-service"
          id="new-service-button"
          onClick={this.addService}
        >
          <i className="material-icons">add_box</i>
          Add New Service
        </button>
      </li>
    );
  }
}

EditServices.propTypes = {
  handleDeactivation: PropTypes.func.isRequired,
  handleServiceChange: PropTypes.func.isRequired,
};

export default EditServices;
