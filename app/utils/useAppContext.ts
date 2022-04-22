import { createContext, useContext } from 'react';
import { GeoCoordinates } from './location';

export const AppContext = createContext({
  userLocation: <GeoCoordinates | null> null,
});

export const useAppContext = () => useContext(AppContext);
