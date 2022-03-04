import React, { ReactElement } from 'react';
import GoogleMap from 'google-map-react';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import SearchEntry from 'components/search/SearchEntry';
import { useAppContext } from 'utils';
import { SearchHit } from '../../models';
import config from '../../config';
import './SearchMap.scss';
import { createMapOptions, UserLocationMarker, CustomMarker } from '../ui/MapElements';

export const SearchMap = ({
  hits, hitsPerPage, page, setMapObject,
}: {
    hits: SearchHit[];
    hitsPerPage: number;
    page: number;
    setMapObject: any;
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
            setMapObject(map);
          }}
          options={createMapOptions}
        >
          <UserLocationMarker lat={lat} lng={lng} key={1} />
          { hits.reduce((markers, hit, index) => {
            // Add a marker for each address of each hit
            hit.addresses?.forEach((addr: any, i: number) => {
              const appendAddressLabel = () => {
                // Appends letter to index number if there are multiple addresses per service
                let tag = `${page * hitsPerPage + index + 1}`;
                if (i > 0) {
                  const alphabeticalIndex = (i + 9).toString(36).toUpperCase();
                  tag += alphabeticalIndex;
                }

                return tag;
              };

              markers.push(<SearchHitMarker
                // The array members aren't editable so using array index shouldn't be a problem
                // eslint-disable-next-line react/no-array-index-key
                key={`${hit.id}.${i}`}
                lat={addr.latitude}
                lng={addr.longitude}
                tag={appendAddressLabel()}
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
