import { connect } from 'react-redux';

import * as types from './actionTypes';

// == Actions ==

const showPopUpMessage = ({ message, type = 'success' }) => (
  {
    type: types.SHOW_POP_UP_MESSAGE,
    popUpMessage: {
      message,
      type,
    },
  }
);

const hidePopUpMessage = () => (
  { type: types.HIDE_POP_UP_MESSAGE }
);

// == Utils ==

const mapDispatchToProps = dispatch => (
  {
    showPopUpMessage: ({ message, type = 'success', duration = 3000 }) => {
      setTimeout(() => dispatch(hidePopUpMessage()), duration);
      dispatch(showPopUpMessage({ message, type }));
    },
  }
);

// If you want your component to be able to show pop-up messages, wrap it using
// the `withPopUpMessages` function.
//
// Example:
//
//   export default withPopUpMessages(OrganizationEditPage);
//
// This will add a new prop to the component, `showPopUpMessage`, which is a
// function that uses a Redux dispatcher to show a pop-up message temporarily.
//
// Example:
//
//  this.props.showPopUpMessage({ message: 'Changes saved.' });
//
// The `showPopUpMessage` function takes an object of this shape:
// {
//   message: <string>,
//   type: <string>, // 'success' or 'error'. Default is 'success'.
//   duration: <number>, // duration in milliseconds. Default is 3000, i.e. 3 seconds.
// }
export const withPopUpMessages = component => (
  connect(null, mapDispatchToProps)(component)
);
