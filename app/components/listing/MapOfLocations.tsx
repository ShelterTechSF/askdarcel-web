import React from "react";
import GoogleMap from "google-map-react";
import config from "../../config";
import { LocationDetails } from "../../models";
import { Loader } from "../ui";
import LocationTimesAccordion from "./LocationTimesAccordion";
import {
  createMapOptions,
  CustomMarker,
  UserLocationMarker,
} from "../ui/MapElements";
import { useAppContext } from "../../utils";
import styles from "./MapOfLocations.module.scss";

// TODO: Accordion needs big refactor/rebuild which is out of scope of this ticket. Will create new ticket.

export const MapOfLocations = ({
  locations,
}: {
  locations: LocationDetails[];
}) => {
  const { userLocation } = useAppContext();
  if (userLocation === null) {
    return <Loader />;
  }
  const { lat, lng } = userLocation;

  return (
    <div className={styles.locationsMap}>
      <div className="map">
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
          }}
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          options={createMapOptions}
        >
          <UserLocationMarker lat={lat} lng={lng} />
          {locations.map(({ address, id }, i) => (
            <CustomMarker
              key={id}
              lat={address?.latitude || 0}
              lng={address?.longitude || 0}
              text={`${i + 1}`}
            />
          ))}
        </GoogleMap>
      </div>
      <LocationTimesAccordion locations={locations} />
    </div>
  );
};
