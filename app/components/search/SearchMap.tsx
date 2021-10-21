import React, { ReactElement } from 'react';
import GoogleMap from 'google-map-react';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import SearchEntry from './SearchEntry';
import config from '../../config';
import './SearchMap.scss';
import { useAppContext } from '../../utils';
import { createMapOptions, UserLocationMarker, CustomMarker } from '../ui/MapElements';
import { SearchHit } from '../../models';

export const SearchMap = ({ hits, hitsPerPage, page }: {
  hits: SearchHit[];
  hitsPerPage: number;
  page: number;
}) => {
  const { userLocation: { lat, lng } } = useAppContext();
  if (!hits || !hits.length) { return null; }

  return (
    <div className="results-map">
      <div className="map-wrapper">
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
          }}
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          options={createMapOptions}
        >
          <UserLocationMarker lat={lat} lng={lng} key={1} />
          { hits.reduce((markers, hit, i) => {
            const hitNumber = `${page * hitsPerPage + i + 1}`;
            // Add a marker for each address of each hit
            hit.addresses?.forEach((addr: any) => {
              markers.push(<SearchHitMarker
                key={hit.id}
                lat={addr.latitude}
                lng={addr.longitude}
                tag={hitNumber}
                hit={hit}
              />);
            });
            return markers;
          }, [] as ReactElement[]) }
        </GoogleMap>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/no-unused-prop-types
const SearchHitMarker = ({ hit, tag }: { lat: any; lng: any; hit: SearchHit; tag: string }) => (
  <Tooltip
    arrow
    html={(<SearchEntry hitNumber={tag} hit={hit} />)}
    interactive
    position="bottom"
    theme="light"
    trigger="click"
    useContext
  >
    <CustomMarker text={tag} />
  </Tooltip>
);
