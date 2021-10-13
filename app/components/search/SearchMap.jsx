import React from 'react';
import { connect } from 'react-redux';
import GoogleMap from 'google-map-react';
import { Tooltip } from 'react-tippy';
import SearchEntry from './SearchEntry';
import config from '../../config';
import 'react-tippy/dist/tippy.css';
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

function CustomMarker({
  hit, index, page, hitsPerPage,
}) {
  const hitNumber = page * hitsPerPage + index + 1;

  const getPopoverHtml = () => {
    if (hit.type === 'service' || hit.type === 'resource') {
      return (
        <SearchEntry
          page={page}
          hitsPerPage={hitsPerPage}
          hit={hit}
          index={index}
        />
      );
    }
    return null;
  };

  return (
    <Tooltip
      arrow
      useContext
      interactive
      html={getPopoverHtml()}
      theme="light"
      trigger="click"
      position="bottom"
    >
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
          <text fontSize="45px" x="65" y="55" fill="#276ce5" fontWeight="bold" textAnchor="middle">{hitNumber}</text>
        </g>
      </svg>
    </Tooltip>
  );
}

const SearchMap = ({
  hits, userLocation, page, hitsPerPage,
}) => {
  if (!hits || !hits.length) {
    return null;
  }

  const markers = hits.map((hit, index) => {
    const { addresses: rawAddresses } = hit;
    const addresses = rawAddresses || [];
    return addresses.map(address => (
      <CustomMarker
        hit={hit}
        page={page}
        hitsPerPage={hitsPerPage}
        lat={address ? address.latitude : 0}
        lng={address ? address.longitude : 0}
        key={address.id}
        index={index}
      />
    ));
  });

  markers.push(<UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} key={1} />);

  return (
    <div className="results-map">
      <div className="map-wrapper">
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
          }}
          defaultCenter={[userLocation.lat, userLocation.lng]}
          defaultZoom={15}
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
