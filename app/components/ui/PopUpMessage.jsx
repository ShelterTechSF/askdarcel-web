import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './PopUpMessage.scss';

const PopUpMessage = ({ popUpMessage }) => {
  const { message, type, visible } = popUpMessage;
  const hidden = visible ? '' : 'hidden';
  return (
    <div className={`pop-up-message ${type} ${hidden}`}>
      {message}
    </div>
  );
};

PopUpMessage.propTypes = {
  popUpMessage: PropTypes.shape({
    // Message to display
    message: PropTypes.string.isRequired,

    // Which type of message: 'success', 'error'. Affects styling.
    type: PropTypes.string.isRequired,

    // Whether or not the message is visible
    visible: PropTypes.bool.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    popUpMessage: state.popUpMessage,
  };
}

export default connect(mapStateToProps)(PopUpMessage);
