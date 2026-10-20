import React, { ReactElement } from "react";
import config from "../../config";
import { LocationDetails } from "../../models";
import { Accordion, AccordionItem } from "../ui/Accordion";

export const MapOfLocations = ({
  locationRenderer,
  locations,
}: {
  locations: LocationDetails[];
  locationRenderer: (loc: LocationDetails) => ReactElement;
}) => {
  return (
    <div>
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
              <>
                <iframe
                  className="map"
                  title={`Map of ${loc.address.address_1}`}
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.google.com/maps/embed/v1/place?${new URLSearchParams(
                    {
                      key: config.GOOGLE_API_KEY,
                      q: `${loc.address.latitude || 0},${
                        loc.address.longitude || 0
                      }`,
                    }
                  )}`}
                />
                {locationRenderer(loc)}
              </>
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
