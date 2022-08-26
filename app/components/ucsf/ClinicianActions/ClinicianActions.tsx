import React from 'react';
import Modal from 'react-modal';

import { icon } from 'assets';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClinicianActions.module.scss';

interface ActionItem {
  action: string;
}

// TODO: mock data until we get data back from the service
const serviceActions = [
  { action: 'Ask the patient to self-refer' },
  { action: 'Call the intake office before sending patient over' },
  { action: 'Tell patient to self-refer at the admissions depot' },
];

const serviceCovidActions = [
  { action: 'Patient must undergo a covid test to eat dinner' },
  { action: 'Ensure patient is vaccinated' },
];
// TODO: end mock data

const ActionList = ({
  header, actions,
}: {
  header: string;
  actions: ActionItem[];
}) => (
  <div className={styles.actionListContainer}>
    <p className={styles.actionType}>{header}</p>
    <ul className={styles.actionList}>
      {actions.map(actionItem => (<li>{actionItem.action}</li>))}
    </ul>
  </div>
);

export const ClinicianActions = ({
  isOpen, setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      className={styles.clinicianActions}
      overlayClassName={styles.clinicianActionsOverlay}
      onRequestClose={closeModal}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={closeModal}
      >
        <img
          src={icon('close')}
          alt="close"
          className={styles.closeModal}
        />
      </div>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Actions</h2>
        <div className={styles.actionLists}>
          <ActionList header="Clinician Actions" actions={serviceActions} />
          <ActionList header="COVID-19 Actions" actions={serviceCovidActions} />
        </div>
        <div className={styles.buttonBar}>
          <Button
            onClick={closeModal}
            addClass={styles.closeBtn}
            tabIndex={0}
          >
            CLOSE
          </Button>
        </div>
      </div>
    </Modal>
  );
};
