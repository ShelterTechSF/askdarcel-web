import React, { ReactElement } from "react";
import GoogleMap from "google-map-react";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import SearchEntry from "components/search/SearchMap/SearchEntry";
import { useAppContext } from "utils";
import { Loader } from "components/ui";
import { Button } from "components/ui/inline/Button/Button";
import {
  createMapOptions,
  UserLocationMarker,
  CustomMarker,
} from "components/ui/MapElements";
import "./SearchMap.scss";
import { icon } from "assets";
import { SearchHit } from "../../../models";
import config from "../../../config";

export const SearchMap = ({
  hits,
  hitsPerPage,
  page,
  mapObject,
  setMapObject,
  setAroundLatLng,
  overlayMapWithSearchResults,
}: {
  hits: SearchHit[];
  hitsPerPage: number;
  page: number;
  mapObject: google.maps.Map | null;
  setMapObject: (map: any) => void;
  setAroundLatLng: (latLng: { lat: number; lng: number }) => void;
  overlayMapWithSearchResults: boolean;
}) => {
  const { userLocation } = useAppContext();
  if (userLocation === null) {
    return (
      <div className="mapLoaderContainer">
        <Loader />
      </div>
    );
  }

  const { lat, lng } = userLocation;

  return (
    <div className="results-map">
      <div className="map-wrapper">
        {/* If map is being overlaid, hide the search area button. It is is neither clickable
            nor relevant in this mode.
        */}
        {!overlayMapWithSearchResults && (
          <Button
            addClass="searchAreaButton"
            styleType="transparent"
            onClick={() => {
              const center = mapObject?.getCenter() || null;
              if (center?.lat() && center?.lng()) {
                setAroundLatLng({ lat: center.lat(), lng: center.lng() });
              }
            }}
          >
            <>
              <img src={icon("search")} alt="search" />
              <span>Search this area</span>
            </>
          </Button>
        )}
        <GoogleMap
          bootstrapURLKeys={{
            key: config.GOOGLE_API_KEY,
          }}
          center={{ lat, lng }}
          defaultZoom={14}
          onGoogleApiLoaded={({ map }) => {
            // SetMapObject shares the Google Map object across parent/sibling components
            // so that they can adjustments to markers, coordinates, layout, etc.,
            setMapObject(map);
          }}
          options={createMapOptions}
        >
          <UserLocationMarker lat={lat} lng={lng} key={1} />
          {hits.reduce((markers, hit, index) => {
            // Add a marker for each address of each hit
            hit.addresses?.forEach((addr: any, i: number) => {
              // Append letter to index number if there are multiple addresses per service
              let tag = `${page * hitsPerPage + index + 1}`;
              if (i > 0) {
                const alphabeticalIndex = (i + 9).toString(36).toUpperCase();
                tag += alphabeticalIndex;
              }

              markers.push(
                <SearchHitMarker
                  key={`${hit.id}.${addr.latitude}.${addr.longitude}.${
                    addr.address_1
                  }.${addr.address_2 || ""}`}
                  lat={addr.latitude}
                  lng={addr.longitude}
                  tag={tag}
                  hit={hit}
                />
              );
            });
            return markers;
          }, [] as ReactElement[])}
        </GoogleMap>
      </div>
    </div>
  );
};

// The GoogleMap component expects children to be passed lat/long,
// even though we don't use them here.
/* eslint-disable react/no-unused-prop-types */
const SearchHitMarker = ({
  hit,
  tag,
}: {
  lat: any;
  lng: any;
  hit: SearchHit;
  tag: string;
}) => (
  <Tooltip
    arrow
    html={<SearchEntry hitNumber={tag} hit={hit} />}
    interactive
    position="bottom"
    theme="light"
    trigger="click"
    useContext
  >
    <CustomMarker text={tag} />
  </Tooltip>
);
/* eslint-enable react/no-unused-prop-types */
