import React from "react";
import ProvidedService from "./ProvidedService";

import type {
  InternalAddress,
  InternalFlattenedService,
  InternalTopLevelService,
} from "../../pages/OrganizationEditPage";

type Props = {
  addService: () => void;
  editServiceById: (
    id: number,
    changes: Partial<InternalTopLevelService>
  ) => void;
  handleDeactivation: (type: "resource" | "service", id: number) => void;
  services: InternalFlattenedService[];
  resourceAddresses: InternalAddress[];
};

const EditServices = ({
  addService,
  editServiceById,
  handleDeactivation,
  services,
  resourceAddresses,
}: Props) => (
  <li className="edit--section--list--item">
    <ul className="edit--section--list--item--sublist edit--service--list">
      {services.map((service, index) => (
        <ProvidedService
          key={`${service.id}`}
          index={index}
          service={service}
          editServiceById={editServiceById}
          handleDeactivation={handleDeactivation}
          resourceAddresses={resourceAddresses}
        />
      ))}
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

export default EditServices;
