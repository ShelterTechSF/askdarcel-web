import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styles from './Texting.scss';
import * as dataService from '../../utils/DataService';
import FormView from './FormView';
import Loader from '../ui/Loader';
import SentView from './SentView';
import ErrorView from './ErrorView';
import closeIcon from './close-icon.svg';

const ServicePropTypes = PropTypes.shape({
  serviceName: PropTypes.string.isRequired,
  service_id: PropTypes.number.isRequired,
});

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
    >
      <button
        className={styles.closeButton}
        onClick={closeModal}
        type="button"
      >
        <img src={closeIcon} alt="Close" />
      </button>
      { activeView }
    </ReactModal>
  );
};

Texting.propTypes = {
  service: ServicePropTypes.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Texting;
