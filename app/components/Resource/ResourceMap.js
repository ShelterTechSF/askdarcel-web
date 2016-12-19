import React, { Component } from 'react';

class ResourceMap extends Component {
  constructor(props) {
    super(props);
    this.state = { userLocation: null };
  }

  componentDidMount() {
    // console.log(this.props);
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

    let currentLocationMarker = new google.maps.Marker({map: map, icon: '../../assets/img/current-location.png'});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        currentLocationMarker.setPosition(pos);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, currentLocationMarker, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, currentLocationMarker, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, currentLocationMarker, pos) {
      currentLocationMarker.setPosition(pos);
      currentLocationMarker.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }
  }

  render() {
    return (<div ref="map_canvas" className="map_canvas"></div>);
  }
}

export default ResourceMap;