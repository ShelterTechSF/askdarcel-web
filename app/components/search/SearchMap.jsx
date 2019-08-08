import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import config from '../../config';
import './SearchMap.scss';

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

function UserLocationMarker() {
  return (
    <svg width="20" height="20">
      <circle cx="10" cy="10" r="5" fill="none" stroke="#007ac7" strokeWidth="5" />
    </svg>
  );
}

function CustomMarker({ index }) {
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
        </g>
        <text fontSize="45px" x="65" y="55" fill="#276ce5" fontWeight="bold" textAnchor="middle">{index + 1}</text>
      </g>
    </svg>
  );
  /*  eslint-enable max-len */
}

const SearchMap = ({ hits, userLocation }) => {
  if (!hits || !hits.length) {
    return null;
  }

  const markers = hits.map((hit, index) => (
    <CustomMarker
      lat={hit._geoloc ? hit._geoloc.lat : 0}
      lng={hit._geoloc ? hit._geoloc.lng : 0}
      key={hit.objectID}
      index={index}
    />
  ));

  markers.push(<UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} key={1} />);
  return (
    <div className="results-map">
      <div className="map-wrapper">
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
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
};

function mapStateToProps(state) {
  return {
    userLocation: state.user.location,
  };
}


export default connect(mapStateToProps)(SearchMap);
