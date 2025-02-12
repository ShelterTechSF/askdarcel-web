import React from "react";
import GoogleMap from "google-map-react";
import config from "../../config";
import { LocationDetails } from "../../models";
import { useAppContext } from "../../utils";
import { computeGridOffset, groupServiceLocations } from "utils/map";
import {
  createMapOptions,
  CustomMarker,
  UserLocationMarker,
} from "../ui/MapElements";
import LocationTimesAccordion from "./LocationTimesAccordion";
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

  const groupedLocations = groupServiceLocations(locations);

  const markers = Object.entries(groupedLocations).flatMap(([, group]) => {
    if (group.length === 1) {
      const { location, markerIndex } = group[0];
      return (
        <CustomMarker
          key={location.id}
          lat={Number(location.address.latitude)}
          lng={Number(location.address.longitude)}
          text={`${markerIndex}`}
        />
      );
    } else {
      const epicenterLat = Number(group[0].location.address.latitude);
      const epicenterLng = Number(group[0].location.address.longitude);

      const groupMarkers = group.map((item, index) => {
        const { offsetLat, offsetLng } = computeGridOffset(
          index,
          group.length,
          { lat: epicenterLat, lng: epicenterLng }
        );
        return (
          <CustomMarker
            key={`${item.location.id}-${index}`}
            lat={offsetLat}
            lng={offsetLng}
            text={`${item.markerIndex}`}
          />
        );
      });
      return groupMarkers.reverse();
    }
  });

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
          {markers}
        </GoogleMap>
      </div>
      <LocationTimesAccordion locations={locations} />
    </div>
  );
};
