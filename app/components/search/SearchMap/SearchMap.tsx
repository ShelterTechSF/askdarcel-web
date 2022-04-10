import React, { ReactElement } from 'react';
import GoogleMap from 'google-map-react';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import SearchEntry from 'components/search/SearchMap/SearchEntry';
import { useAppContext } from 'utils';
import { createMapOptions, UserLocationMarker, CustomMarker } from 'components/ui/MapElements';
import './SearchMap.scss';
import { SearchHit } from '../../../models';
import config from '../../../config';

export const SearchMap = ({
  hits, hitsPerPage, page, setMapObject,
}: {
    hits: SearchHit[];
    hitsPerPage: number;
    page: number;
    setMapObject: (map: any) => void;
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
          defaultZoom={14}
          onGoogleApiLoaded={({ map }) => {
            // SetMapObject shares the Google Map object across parent/sibliing components
            // so that they can adjustments to markers, coordinates, layout, etc.,
            setMapObject(map);
          }}
          options={createMapOptions}
        >
          <UserLocationMarker lat={lat} lng={lng} key={1} />
          { hits.reduce((markers, hit, index) => {
            // Add a marker for each address of each hit
            hit.addresses?.forEach((addr: any, i: number) => {
              // Append letter to index number if there are multiple addresses per service
              let tag = `${page * hitsPerPage + index + 1}`;
              if (i > 0) {
                const alphabeticalIndex = (i + 9).toString(36).toUpperCase();
                tag += alphabeticalIndex;
              }

              markers.push(<SearchHitMarker
                key={`${hit.id}.${addr.latitude}.${addr.longitude}.${addr.address_1}.${addr.address_2 || ''}`}
                lat={addr.latitude}
                lng={addr.longitude}
                tag={tag}
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

// The GoogleMap component expects children to be passed lat/long,
// even though we don't use them here.
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
