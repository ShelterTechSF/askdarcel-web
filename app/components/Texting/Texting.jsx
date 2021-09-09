import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { icon } from 'assets';
import styles from './Texting.module.scss';
import * as dataService from '../../utils/DataService';
import FormView from './components/FormView';
import Loader from '../ui/Loader';
import SentView from './components/SentView';
import ErrorView from './components/ErrorView';

// Text resource informations to the user phone

const Texting = ({ closeModal, service, isShowing }) => {
  const [view, setView] = useState('');

  // Send data to backend
  const sendData = data => dataService.post(
    '/api/textings', { data },
  ).then(response => {
    if (response.ok) {
      setView('sentView');
    }
  })
    .catch(() => setView('errorView'));

  const handleSubmit = data => {
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
      parentSelector={() => document.querySelector('#root')}
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

Texting.propTypes = {
  service: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    serviceId: PropTypes.number.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
};

export default Texting;
