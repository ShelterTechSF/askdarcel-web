import { createContext, useContext } from 'react';
import { COORDS_MID_SAN_FRANCISCO } from './location';

export const AppContext = createContext({
  userLocation: COORDS_MID_SAN_FRANCISCO,
  userLocationPromiseReturned: false,
});

export const useAppContext = () => useContext(AppContext);
