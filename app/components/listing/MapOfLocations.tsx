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
import { distanceInMiles, useAppContext } from "../../utils";
import "./MapOfLocations.scss";

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

  const distanceFromUser = (loc: LocationDetails) =>
    distanceInMiles(userLocation, {
      lat: Number(loc.address?.latitude) || 0,
      lng: Number(loc.address?.longitude) || 0,
    });
  const sortedLocations = [...locations].sort(
    (a, b) => distanceFromUser(a) - distanceFromUser(b)
  );

  return (
    <div>
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
          {sortedLocations.map(({ address, id }, i) => (
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
          {sortedLocations.map((loc, i) => (
            <AccordionItem
              key={loc.address.id}
              headerRenderer={
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="location-index">{i + 1}.</td>
                        <td className="location-address">
                          <strong className="notranslate">
                            {loc.address.address_1}
                          </strong>
                        </td>
                        <td>
                          {loc.address.latitude && loc.address.longitude && (
                            <a
                              className="location-directions-link"
                              href={`https://google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${loc.address.latitude},${loc.address.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Directions
                            </a>
                          )}
                        </td>
                        <td className="iconcell">
                          <div className="selector">
                            <i className="material-symbols-outlined">
                              keyboard_arrow_down
                            </i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* TODO Transportation options */}
                </div>
              }
            >
              {locationRenderer(loc)}
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {/* <table>
        <tbody>
          { locations.map((loc, i) => (
            <tr key={loc.name}>
              <th>{ i }.</th>
              <td>{ loc.address.address_1 }</td>
              <td></td>
            </tr>
          )) }
        </tbody>
      </table> */}
    </div>
  );
};
