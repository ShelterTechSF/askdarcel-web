import React, { Component } from 'react';

class ResourceMap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
      let latLng = new google.maps.LatLng(this.props.lat, this.props.long);
      let map = new google.maps.Map(this.refs.map_canvas, {
        center: latLng,
        zoom: 13
      });
      let marker = new google.maps.Marker({
        position: latLng,
        map,
        title: this.props.name
      });
      let userMarker = new google.maps.Marker({
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: 'blue',
              fillOpacity: 0.8,
              strokeColor: 'blue',
              strokeWeight: 12,
              strokeOpacity: 0.2
            },
            title: 'Your position'
          });
      if (this.props.userLocation) {
        userMarker.setPosition(this.props.userLocation);
      }
  }


  render() {
    return (<div ref="map_canvas" className="map_canvas"></div>);
  }
}

export default ResourceMap;