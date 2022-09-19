import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { icon } from 'assets';
import styles from './Texting.module.scss';
import * as dataService from '../../utils/DataService';
import { FormView } from './components/FormView';
import { Loader } from '../ui';
import { SentView } from './components/SentView';
import { ErrorView } from './components/ErrorView';

/** A view of a Service from within the Texting component.
 *
 * TODO: Replace this with an app-wide Service type.
 */
export interface TextingService {
  serviceName: string;
  serviceId: number;
}

/** Payload for the create Texting API endpoint. */
export interface APITexting {
  recipient_name: string;
  phone_number: string;
  service_id: number;
}

// Text resource informations to the user phone

export const Texting = ({ closeModal, service, isShowing }:
  { closeModal: () => void; service: TextingService; isShowing: boolean }) => {
  const [view, setView] = useState('');

  // Send data to backend
  const sendData = (data: APITexting) => dataService.post('/api/textings', { data }).then(response => {
    if (response.ok) {
      setView('sentView');
    }
  })
    .catch(() => setView('errorView'));

  const handleSubmit = (data: APITexting) => {
    setView('loader');
    sendData(data);
  };

  let activeView;

  switch (view) {
    case 'loader':
      activeView = <Loader />;
      break;
    case 'sentView':
      activeView = <SentView />;
      break;
    case 'errorView':
      activeView = <ErrorView />;
      break;
    default:
      activeView = (
        <FormView
          handleSubmit={handleSubmit}
          service={service}
          closeModal={closeModal}
        />
      );
  }

  return (
    <ReactModal
      className={styles.content}
      overlayClassName={styles.overlay}
      isOpen={isShowing}
      onRequestClose={closeModal}
      ariaHideApp={false}
      parentSelector={() => document.querySelector('#root')!}
    >
      <button
        className={styles.closeButton}
        onClick={closeModal}
        type="button"
      >
        <img src={icon('close')} alt="Close" />
      </button>
      { activeView }
    </ReactModal>
  );
};
