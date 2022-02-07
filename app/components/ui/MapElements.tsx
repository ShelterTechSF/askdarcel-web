import React from 'react';

export const createMapOptions = (maps: any) => ({
  zoomControlOptions: {
    position: maps.ControlPosition.LEFT_TOP,
    style: maps.ZoomControlStyle.SMALL,
  },
  mapTypeControlOptions: {
    position: maps.ControlPosition.TOP_RIGHT,
  },
  mapTypeControl: true,
});

// eslint-disable-next-line react/no-unused-prop-types, no-empty-pattern
export const UserLocationMarker = ({}: { lat?: any; lng?: any }) => (
  <svg width="20" height="20">
    <circle cx="10" cy="10" r="5" fill="none" stroke="#007ac7" strokeWidth="5" />
  </svg>
);

// eslint-disable-next-line react/no-unused-prop-types
export const CustomMarker = ({ text }: { text: string; lat?: any; lng?: any }) => (
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
      <text fontSize="45px" x="65" y="55" fill="#276ce5" fontWeight="bold" textAnchor="middle">{text}</text>
    </g>
  </svg>
);
