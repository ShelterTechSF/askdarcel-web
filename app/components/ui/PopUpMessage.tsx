import React from 'react';
import './PopUpMessage.scss';

export const PopUpMessage = ({ popUpMessage }: { popUpMessage: PopupMessageProp }) => {
  const { message, type, visible } = popUpMessage;
  const hidden = visible ? '' : 'hidden';
  return (
    <div className={`pop-up-message ${type} ${hidden}`}>
      {message}
    </div>
  );
};

export interface PopupMessageProp {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}
