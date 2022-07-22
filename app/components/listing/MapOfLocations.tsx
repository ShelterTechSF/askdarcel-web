import React, { ReactElement } from 'react';
import GoogleMap from 'google-map-react';
import config from '../../config';
import { LocationDetails } from '../../models';
import { Loader } from '../ui';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { createMapOptions, CustomMarker, UserLocationMarker } from '../ui/MapElements';
import { useAppContext } from '../../utils';

export function MapOfLocations({ locationRenderer, locations }: {
  locations: LocationDetails[];
  locationRenderer: (loc: LocationDetails) => ReactElement;
}) {
  const { userLocation } = useAppContext();
  if (userLocation === null) {
    return <Loader />;
  }
  const { lat, lng } = userLocation;

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
          { locations.map(({ address, id }, i) => <CustomMarker key={id} lat={address?.latitude || 0} lng={address?.longitude || 0} text={`${i + 1}`} />) }
        </GoogleMap>
      </div>
      { locationRenderer
        && (
          <Accordion>
            { locations.map((loc, i) => (
              <AccordionItem
                key={loc.address.id}
                headerRenderer={(
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="iconcell">
                            {i + 1}
                            .
                          </td>
                          <td><strong>{loc.address.address_1}</strong></td>
                          <td className="iconcell">
                            <div className="selector">
                              <i className="material-icons">keyboard_arrow_down</i>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* TODO Transportation options */}
                  </div>
                )}
              >
                { locationRenderer(loc) }
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
}
