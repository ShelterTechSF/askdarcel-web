import { PopupMessageProp } from 'components/ui/PopUpMessage';
import { createContext, useContext } from 'react';
import { COORDS_MID_SAN_FRANCISCO } from './location';

export const AppContext = createContext({
  setPopUpMessage: (msg: PopupMessageProp) => {}, // eslint-disable-line no-unused-vars
  userLocation: COORDS_MID_SAN_FRANCISCO,
});

export const useAppContext = () => useContext(AppContext);
