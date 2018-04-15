import React from 'react';
import { connectHits } from 'react-instantsearch/connectors';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';

function createMapOptions(maps) {
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.LEFT_TOP,
      style: maps.ZoomControlStyle.SMALL,
    },
    mapTypeControlOptions: {
      position: maps.ControlPosition.TOP_RIGHT,
    },
    mapTypeControl: true,
  };
}

function HitsMap({ hits, userLocation }) {
  if (!hits.length) {
    return null;
  }

  const markers = hits.map(hit => (
    <CustomMarker lat={hit._geoloc.lat} lng={hit._geoloc.lng} key={hit.objectID} />
  ));

  markers.push(<UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} />);

  return (
    <div className="results-map">
      <div className="map-wrapper">
        <GoogleMap
          bootstrapURLKeys={{
            key: CONFIG.GOOGLE_API_KEY,
          }}
          center={{ lat: userLocation.lat, lng: userLocation.lng }}
          defaultZoom={14}
          options={createMapOptions}
        >
          {markers}
        </GoogleMap>
      </div>
    </div>
  );
}

function UserLocationMarker() {
  return (
    <svg width="20" height="20">
      <circle cx="10" cy="10" r="5" fill="none" stroke="#007ac7" strokeWidth="5" />
    </svg>
  );
}

function CustomMarker() {
  /*  eslint-disable max-len */
  return (
    <svg width="30" height="50" viewBox="0 0 102 60" className="marker">
      <g fill="none" fillRule="evenodd">
        <g
          transform="translate(-60, 0)"
          stroke="#8962B2"
          id="pin"
          viewBox="0 0 100 100"
        >
          <path
            d="M157.39 34.315c0 18.546-33.825 83.958-33.825 83.958S89.74 52.86 89.74 34.315C89.74 15.768 104.885.73 123.565.73c18.68 0 33.825 15.038 33.825 33.585z"
            strokeWidth="5.53"
            fill="#E6D2FC"
          />
          <path
            d="M123.565 49.13c-8.008 0-14.496-6.498-14.496-14.52 0-8.017 6.487-14.52 14.495-14.52s14.496 6.503 14.496 14.52c0 8.022-6.487 14.52-14.495 14.52z"
            strokeWidth="2.765"
            fill="#FFF"
          />
        </g>
      </g>
    </svg>
  );
  /*  eslint-enable max-len */
}

// const SearchMap = connectHits(HitsMap);

const SearchMap = ({hits, userLocation}) => {
  if (!hits || !hits.length) {
    return null;
  }
  console.log('hits:', hits)

  const markers = hits.map(hit => (
    <CustomMarker lat={hit._geoloc.lat} lng={hit._geoloc.lng} key={hit.objectID} />
  ));

  markers.push(<UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} key={1}/>);
  return (
    <div className="results-map">
      <div className="map-wrapper">
        <GoogleMap
          bootstrapURLKeys={{
            key: CONFIG.GOOGLE_API_KEY,
          }}
          center={{ lat: userLocation.lat, lng: userLocation.lng }}
          defaultZoom={14}
          options={createMapOptions}
        >
          {markers}
        </GoogleMap>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}


export default connect(mapStateToProps)(SearchMap);
