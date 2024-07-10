import React, { ReactElement } from "react";
import GoogleMap from "google-map-react";
import config from "../../config";
import { LocationDetails } from "../../models";
import { Loader } from "../ui";
import { Accordion, AccordionItem } from "../ui/Accordion";
import {
  createMapOptions,
  CustomMarker,
  UserLocationMarker,
} from "../ui/MapElements";
import { useAppContext } from "../../utils";
import styles from "./MapOfLocations.module.scss";

// TODO: Accordion needs big refactor/rebuild which is out of scope of this ticket. Will create new ticket.

export const MapOfLocations = ({
  locationRenderer,
  locations,
}: {
  locations: LocationDetails[];
  locationRenderer: (loc: LocationDetails) => ReactElement;
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
      {locationRenderer && (
        <Accordion>
          {locations.map((loc, i) => (
            <AccordionItem
              key={loc.address.id}
              headerRenderer={
                <table>
                  <tbody>
                    <tr>
                      <td className="headerCell">
                        <strong className="notranslate">
                          <h3>{`${i + 1}. ${loc.address.address_1}`}</h3>
                        </strong>
                      </td>
                      <td className="iconCell">
                        <div className="selector">
                          <i className="material-icons">keyboard_arrow_down</i>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              }
            >
              {locationRenderer(loc)}
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
