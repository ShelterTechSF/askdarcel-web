import React from 'react';
import PropTypes from 'prop-types';
import ProvidedService from './ProvidedService';


const EditServices = ({
  addService, editServiceById, handleDeactivation, services,
}) => (
  <li className="edit--section--list--item">
    <ul className="edit--section--list--item--sublist edit--service--list">
      {
        services.map((service, index) => (
          <ProvidedService
            key={`${service.id}`}
            index={index}
            service={service}
            handleChange={editServiceById}
            handleDeactivation={handleDeactivation}
          />
        ))
      }
    </ul>
    <button
      type="button"
      className="edit--section--list--item--button new-service"
      id="new-service-button"
      onClick={addService}
    >
      <i className="material-icons">add_box</i>
          Add New Service
    </button>
  </li>
);

EditServices.propTypes = {
  handleDeactivation: PropTypes.func.isRequired,
  editServiceById: PropTypes.func.isRequired,
  addService: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
};

export default EditServices;
