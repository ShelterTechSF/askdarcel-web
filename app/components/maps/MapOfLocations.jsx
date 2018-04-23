import React from 'react';
import PropTypes from 'prop-types';

import { RelativeOpeningTime } from '../listing';
import { Accordion, AccordionItem } from '../ui/Accordion';

class MapOfLocations extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentWillMount() {
    this.setState({
      locations: this.props.locations.map((loc) => {
        const { address, name, schedule } = loc;
        return {
          name,
          address,
          schedule,
        };
      }),
    });
  }

  componentDidMount() {
    // TODO We should probably not just have google on the global namespace
    if (google === undefined) { return; }

    const { Map, Marker, LatLng, SymbolPath } = google.maps;
    const { locations } = this.state;
    const { latitude, longitude } = locations[0].address;
    // TODO Geocode from address if no lat/long

    const mapOptions = {
      zoom: 13,
      center: { lat: Number(latitude), lng: Number(longitude) },
      disableDefaultUI: true,
    };

    const map = new Map(this.refs.map, mapOptions);

    if (this.props.userLocation) {
      const userMarker = new Marker({
        map,
        position: new LatLng(this.props.userLocation),
        icon: { path: SymbolPath.CIRCLE, scale: 5 },
      });
    }

    locations.forEach((loc) => {
      console.log(loc);
      const { address, name } = loc;
      const locMarker = new google.maps.Marker({
        map,
        icon: {
          title: name,
          label: name,
        },
        position: new LatLng(Number(address.latitude), Number(address.longitude)),
      });
    });
  }

  render() {
    const { locations } = this.state;
    return (
      <div>
        <div ref="map" className="map" />
        { this.props.locationRenderer &&
          <Accordion>
            { locations.map((loc, i) => (
              <AccordionItem
                key={i}
                title={loc.address.address_1}
                headerRenderer={title => (
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="iconcell">{i}.</td>
                          <td><strong>{title}</strong></td>
                          <td className="right"><RelativeOpeningTime schedule={loc.schedule} /></td>
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
                { this.props.locationRenderer(loc) }
              </AccordionItem>))
            }
          </Accordion>
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
