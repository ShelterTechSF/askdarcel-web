import React, { Component } from 'react';

class Gmap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userMarker: null,
      map: null,
      markers: []
    };
  }

  // getLocation(callback) {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(callback);
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // }

  setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  generateMarkers(locs, map) {
    let markers = [];
    let offset = 1;

    locs.forEach((loc, index) => {
      var latLang = new google.maps.LatLng(loc[0], loc[1]);
      let marker = new google.maps.Marker({
        position: latLang,
        map: map,
        label: (index + offset)+'',
        title: 'Resource ' + (index + offset)
      });
      markers.push(marker);
    });

    this.setState({
      markers: markers
    });
  }

  componentDidMount() {
    let map = new google.maps.Map(this.refs.map_canvas, {
      center: this.props.markers.user,
      zoom: 13
    });

    let userMarker = new google.maps.Marker({
      position: this.props.markers.user,
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

    this.setState({
      map: map,
      userMarker: userMarker
    })

    if(this.props.markers.results && this.props.markers.results.length) {
      this.generateMarkers(this.props.markers.results, map);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setMapOnAll(null, this.state.markers);
    this.state.userMarker.setMap(this.state.map);
    this.generateMarkers(newProps.markers.results, this.state.map);
  }

  render() {
    return (
      <div ref="map_canvas" className="map_canvas"></div>
    )
  }
}

export default Gmap;