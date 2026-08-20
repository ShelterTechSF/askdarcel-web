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
import { useInView } from "../../hooks/useInView";

export const MapOfLocations = ({
  locationRenderer,
  locations,
}: {
  locations: LocationDetails[];
  locationRenderer: (loc: LocationDetails) => ReactElement;
}) => {
  const { userLocation } = useAppContext();
  // Location/organization detail pages render this component well below the
  // fold (after About, Details, Contact Info, etc). Since every mount of
  // <GoogleMap> is a billable Maps JavaScript API "map load", we defer
  // mounting it until the map container is about to scroll into view. This
  // avoids paying for a map load on every page view, including the many
  // visitors who never scroll down that far.
  const [mapContainerRef, isMapInView] = useInView<HTMLDivElement>({
    rootMargin: "300px",
  });

  if (userLocation === null) {
    return <Loader />;
  }
  const { lat, lng } = userLocation;

  return (
    <div>
      <div className="map" ref={mapContainerRef}>
        {isMapInView ? (
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
        ) : (
          <Loader />
        )}
      </div>
      {locationRenderer && (
        <Accordion>
          {locations.map((loc, i) => (
            <AccordionItem
              key={loc.address.id}
              headerRenderer={
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="iconcell">{i + 1}.</td>
                        <td>
                          <strong className="notranslate">
                            {loc.address.address_1}
                          </strong>
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
