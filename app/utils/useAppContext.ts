import { PopupMessageProp } from 'components/ui/PopUpMessage';
import { createContext, useContext } from 'react';
import { COORDS_MID_SAN_FRANCISCO } from './location';

export const AppContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPopUpMessage: (msg: PopupMessageProp) => {},
  userLocation: COORDS_MID_SAN_FRANCISCO,
});

export const useAppContext = () => useContext(AppContext);
