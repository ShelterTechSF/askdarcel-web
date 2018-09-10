import React, { Component } from 'react';

class Gmap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userMarker: null,
      map: null,
      markers: [],
    };
  }

  componentDidMount() {
    const map = new google.maps.Map(this.refs.map_canvas, {
      center: this.props.markers.user,
      zoom: 13,
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

    /* eslint-disable react/no-did-mount-set-state */
    this.setState({
      map,
      userMarker,
    });

    if (this.props.markers.results && this.props.markers.results.length) {
      this.generateMarkers(this.props.markers.results, map);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setMapOnAll(null, this.state.markers);
    this.state.userMarker.setMap(this.state.map);
    this.generateMarkers(newProps.markers.results, this.state.map);
  }

  /* eslint-disable class-methods-use-this */
  setMapOnAll(map, markers) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  generateMarkers(locs, map) {
    const markers = [];
    const offset = 1;

    locs.forEach((loc, index) => {
      const latLang = new google.maps.LatLng(loc[0], loc[1]);
      const marker = new google.maps.Marker({
        position: latLang,
        map,
        label: `${index + offset}`,
        title: `Resource ${index + offset}`,
      });
      markers.push(marker);
    });

    this.setState({
      markers,
    });
  }

  render() {
    return (
      <div className="results-map-inner">
        <div ref="map_canvas" className="map_canvas" />
      </div>
    );
  }
}

export default Gmap;
