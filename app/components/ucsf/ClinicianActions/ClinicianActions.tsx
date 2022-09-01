import React from 'react';

import { icon } from 'assets';
import { Modal } from 'components/ui/Modal/Modal';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClinicianActions.module.scss';

interface ActionItem {
  action: string;
  id: string;
}

// TODO: mock data until we get data back from the service
const serviceActions = [
  { id: '1', action: 'Ask the patient to self-refer' },
  { id: '2', action: 'Call the intake office before sending patient over' },
  { id: '3', action: 'Tell patient to self-refer at the admissions depot' },
];

const serviceCovidActions = [
  { id: '1', action: 'Patient must undergo a covid test to eat dinner' },
  { id: '2', action: 'Ensure patient is vaccinated' },
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
      {actions.map(actionItem => (<li key={actionItem.id}>{actionItem.action}</li>))}
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
      addModalClass={styles.clinicianActions}
      closeModal={closeModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Actions</h2>
        <div className={styles.actionLists}>
          <ActionList header="Clinician Actions" actions={serviceActions} />
          <ActionList header="COVID-19 Actions" actions={serviceCovidActions} />
        </div>
        <div className={styles.buttonBar}>
          <Button onClick={closeModal} addClass={styles.closeBtn} tabIndex={0}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
