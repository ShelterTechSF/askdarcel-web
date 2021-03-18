import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionItem } from '../ui/Accordion';

// TODO We should probably not just have google on the global namespace
/* global google */

class MapOfLocations extends React.Component {
  componentDidMount() {
    if (typeof google === 'undefined' || google === null) { return; }

    const {
      Map, Marker, LatLng, SymbolPath,
    } = google.maps;
    const { locations } = this.props;
    const { latitude, longitude } = locations[0].address;
    // TODO Geocode from address if no lat/long

    const mapOptions = {
      zoom: 13,
      center: { lat: Number(latitude), lng: Number(longitude) },
      disableDefaultUI: true,
    };

    const map = new Map(this.map, mapOptions);
    const { userLocation } = this.props;

    if (userLocation) {
      const userMarker = new Marker({
        position: new LatLng(userLocation),
        icon: { path: SymbolPath.CIRCLE, scale: 5 },
      });
      userMarker.setMap(map);
    }

    locations.forEach(loc => {
      const { address, name } = loc;
      const locMarker = new Marker({
        icon: {
          title: name,
          label: name,
        },
        position: new LatLng(Number(address.latitude), Number(address.longitude)),
      });
      locMarker.setMap(map);
    });
  }

  render() {
    const { locationRenderer } = this.props;
    const { locations } = this.props;

    return (
      <div>
        <div ref={m => { this.map = m; }} className="map" />
        { locationRenderer
          && (
            <Accordion>
              { locations.map((loc, i) => (
                <AccordionItem
                  key={loc.address.id}
                  title={loc.address.address_1}
                  headerRenderer={title => (
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td className="iconcell">
                              {i + 1}
                              .
                            </td>
                            <td><strong>{title}</strong></td>
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
              ))
              }
            </Accordion>
          )
        }
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
}

MapOfLocations.propTypes = {
  locations: PropTypes.array.isRequired,
};

export default MapOfLocations;
