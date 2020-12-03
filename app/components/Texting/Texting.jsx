import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { images } from 'assets';
import styles from './Texting.scss';
import * as dataService from '../../utils/DataService';
import FormView from './FormView';
import Loader from '../ui/Loader';
import SentView from './SentView';
import ErrorView from './ErrorView';

// Text resource informations to the user phone

const Texting = ({ toggle, resource }) => {
  const [view, changeView] = useState('FormView');

  // Send data to backend
  const sendData = async data => dataService.post(
    '/api/textings', { data },
  ).then(response => {
    if (response.ok) {
      changeView('SentView');
    }
  })
    .catch(() => changeView('ErrorView'));

  const handleSubmit = data => {
    changeView('Loader');
    sendData(data);
  };

  const myViews = {
    FormView: <FormView handleSubmit={handleSubmit} resource={resource} toggle={toggle} />,
    Loader: <Loader />,
    SentView: <SentView />,
    ErrorView: <ErrorView />,
  };

  return (
    ReactDOM.createPortal(
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <div className={styles.closeIconDiv} role="button" onClick={toggle} tabIndex={0}>
            <img src={images.icon('close')} alt="close" className={styles.closeIcon} />
          </div>
          { myViews[view] }
        </div>
      </div>, document.body,
    )
  );
};

Texting.propTypes = {
  resource: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Texting;
