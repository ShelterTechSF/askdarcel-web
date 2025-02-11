import React from "react";
import GoogleMap from "google-map-react";
import config from "../../config";
import { LocationDetails } from "../../models";
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

  const {
    coords: { lat: userLat, lng: userLng },
    inSanFrancisco,
  } = userLocation;
  const [serviceLat, serviceLng] = [
    Number(locations[0].address.latitude),
    Number(locations[0].address.longitude),
  ];

  return (
    <div className={styles.locationsMap} data-testid="map-of-locations">
      <div className="map">
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
          }}
          defaultCenter={{ lat: serviceLat, lng: serviceLng }}
          defaultZoom={13}
          options={createMapOptions}
        >
          {inSanFrancisco && <UserLocationMarker lat={userLat} lng={userLng} />}
          {locations.map(({ address, id }, i) => (
            <CustomMarker
              key={id}
              lat={Number(address?.latitude) || 0}
              lng={Number(address?.longitude) || 0}
              text={`${i + 1}`}
            />
          ))}
        </GoogleMap>
      </div>
      <LocationTimesAccordion locations={locations} />
    </div>
  );
};
