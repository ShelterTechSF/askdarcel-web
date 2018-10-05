import React, { Component } from 'react';

class ResourceMap extends Component {
  componentDidMount() {
    const latLng = new google.maps.LatLng(this.props.lat, this.props.long);
    const map = new google.maps.Map(this.refs.map_canvas, {
      center: latLng,
      zoom: 13,
    });
    /* eslint-disable no-unused-vars */
    const marker = new google.maps.Marker({
      position: latLng,
      map,
      title: this.props.name,
    });
    const userMarker = new google.maps.Marker({
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: 'blue',
        fillOpacity: 0.8,
        strokeColor: 'blue',
        strokeWeight: 12,
        strokeOpacity: 0.2,
      },
      title: 'Your position',
    });
    if (this.props.userLocation) {
      userMarker.setPosition(this.props.userLocation);
    }
  }


  render() {
    return (<div ref="map_canvas" className="map_canvas" />);
  }
}

export default ResourceMap;
