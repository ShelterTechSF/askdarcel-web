import React, { ReactElement } from "react";
import config from "../../config";
import { LocationDetails } from "../../models";
import { Loader } from "../ui/Loader";
import { Accordion } from "../ui/Accordion";
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
      {locationRenderer && (
        <Accordion
          items={sortedLocations}
          getKey={(loc) => loc.address.id}
          headerRenderer={(loc, i) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
          )}
          sectionRenderer={(loc) => (
            <>
              {loc.address.latitude && loc.address.longitude && (
                <iframe
                  className="map"
                  title={`Map of ${loc.address.address_1}`}
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.google.com/maps/embed/v1/place?${new URLSearchParams(
                    {
                      key: config.GOOGLE_API_KEY,
                      q: `${loc.address.latitude},${loc.address.longitude}`,
                    }
                  )}`}
                />
              )}
              {locationRenderer(loc)}
            </>
          )}
        />
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
