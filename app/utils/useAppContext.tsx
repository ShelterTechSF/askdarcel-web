import { AroundRadius } from "algoliasearch";
import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { GeoCoordinates } from "utils";

interface Context {
  userLocation: GeoCoordinates | null;
  aroundUserLocationRadius?: AroundRadius;
  aroundLatLng: string;
}

interface ContextUpdater {
  setAroundRadius: Dispatch<SetStateAction<"all" | number>>;
  setAroundLatLng: Dispatch<SetStateAction<string>>;
}

interface AppProviderProps {
  userLocation: GeoCoordinates | null;
  children: React.ReactNode;
}

export const AppContext = createContext<Context>({
  userLocation: null,
  aroundUserLocationRadius: "all",
  aroundLatLng: "",
});

export const AppContextUpdater = createContext<ContextUpdater>({
  setAroundRadius: () => "all",
  setAroundLatLng: () => "all",
});

export const useAppContext = () => useContext(AppContext);
export const useAppContextUpdater = () => useContext(AppContextUpdater);

export const AppProvider = ({ children, userLocation }: AppProviderProps) => {
  const [aroundUserLocationRadius, setAroundRadius] = useState<AroundRadius>(
    "all" as const
  );
  const [aroundLatLng, setAroundLatLng] = useState<string>("");
  // We have to use useMemo here to manage the contextValue to ensure that the user's authState
  // propagates downward after authentication. I couldn't find a way to get this to work with
  // useState. Moreover, we can't use a simple object to define contextValue, as the object would
  // be recreated at each render and thus force all of its child components to re-render as well.
  const contextValue = useMemo(() => {
    return {
      userLocation,
      aroundUserLocationRadius,
      aroundLatLng,
    };
  }, [userLocation, aroundUserLocationRadius, aroundLatLng]);

  return (
    <AppContext.Provider value={contextValue}>
      <AppContextUpdater.Provider value={{ setAroundRadius, setAroundLatLng }}>
        {children}
      </AppContextUpdater.Provider>
    </AppContext.Provider>
  );
};

// NEEd to add setting function in ehre
