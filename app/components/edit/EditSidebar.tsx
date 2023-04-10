import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import type { RouteComponentProps } from "react-router";

import type {
  InternalOrganization,
  InternalTopLevelService,
} from "../../pages/OrganizationEditPage";
import * as dataService from "../../utils/DataService";
import styles from "./EditSidebar.module.scss";

type SaveButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};
const SaveButton = ({ children, disabled, onClick }: SaveButtonProps) => (
  <button
    type="button"
    className={styles.actionButton}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

type EditSidebarProps = RouteComponentProps & {
  addService: () => void;
  certifyHAP: () => void;
  createResource: () => void;
  handleCancel: () => void;
  handleDeactivation: (type: "resource" | "service", id: number) => void;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
  newResource: boolean;
  newServices?: Record<number, InternalTopLevelService>;
  resource: InternalOrganization;
  submitting: boolean;
};

const EditSidebar = ({
  addService,
  certifyHAP,
  createResource,
  handleCancel,
  handleDeactivation,
  handleSubmit,
  newResource,
  newServices = {},
  resource,
  submitting,
}: EditSidebarProps) => {
  const history = useHistory();
  let actionButtons: JSX.Element[];

  const handleActivation = (id: number): void => {
    /* eslint-disable no-alert */
    if (window.confirm("Are you sure you want to reactivate this resource?")) {
      dataService
        .post(`/api/resources/${resource.id}/change_requests`, {
          change_request: { status: "approved" },
        })
        .then(() => {
          alert(
            "The resource has been activated. Thank you for your assistance!"
          );
          history.go(0);
        });
    }
    /* eslint-enable no-alert */
  };

  if (!newResource) {
    const resourceID = resource.id;
    if (resourceID === undefined)
      throw new Error(
        "resource.id should not be undefined for existing resource"
      );
    actionButtons = [
      <SaveButton key="submit" disabled={submitting} onClick={handleSubmit}>
        Save Changes
      </SaveButton>,
      <button
        type="button"
        className={`${styles.actionButton} ${styles.deactivate}`}
        key="deactive"
        disabled={submitting}
        onClick={() =>
          resource.status === "inactive"
            ? handleActivation(resourceID)
            : handleDeactivation("resource", resourceID)
        }
      >
        {`${resource.status === "inactive" ? "Activate" : "Deactivate"}`}
      </button>,
    ];
  } else {
    actionButtons = [
      <SaveButton key="submit" disabled={submitting} onClick={createResource}>
        Submit
      </SaveButton>,
      <button
        type="button"
        className={`${styles.actionButton} ${styles.cancel}`}
        key="cancel"
        onClick={handleCancel}
      >
        Cancel
      </button>,
    ];
  }
  if (!resource.certified) {
    actionButtons.push(
      <button
        type="button"
        className={styles.actionButton}
        key="hap"
        onClick={certifyHAP}
      >
        HAP Approve
      </button>
    );
  }
  // Populate existing services so they show up on the sidebar
  // Do a 2-level-deep clone of the newServices object
  const allServices = Object.entries(newServices).reduce(
    (acc, [id, service]: any) => ({ ...acc, [id]: { ...service } }),
    {}
  );
  if (resource.services) {
    resource.services.forEach((service) => {
      allServices[service.id].name = service.name;
    });
  }
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <h3 className={styles.listHeading}>Organization</h3>
        <ul className={styles.list}>
          <li className={`${styles.listItem} ${styles.active}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#">{resource.name}</a>
          </li>
        </ul>

        <h3
          className={`${styles.listHeading} ${newResource && styles.disabled}`}
        >
          <a href="#services">Services</a>
          <button
            type="button"
            className={styles.serviceActionButton}
            onClick={addService}
            disabled={newResource}
          >
            <i className="material-icons">add_circle_outline</i>
          </button>
        </h3>
        {newResource && (
          <p className={styles.servicesDisabledText}>
            The organization must be submitted before you can add services.
          </p>
        )}
        <ul className={styles.list}>
          {Object.entries(allServices).map(([key, service]: any) => (
            <li key={key} className={styles.listItem}>
              <a
                href={`#${key}`}
                style={{ display: "block" }}
                onClick={(e) => {
                  e.preventDefault();
                  const topOfElement = document.getElementById(key)!.offsetTop;
                  window.scroll({ top: topOfElement, behavior: "smooth" });
                }}
              >
                {service.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>{actionButtons}</div>
    </nav>
  );
};

export default withRouter(EditSidebar);
