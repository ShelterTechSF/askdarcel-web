import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  connectStateResults,
  SearchResults as SearchResultsProps,
} from "react-instantsearch/connectors";
import { CATEGORIES } from "pages/ServiceDiscoveryForm/constants";
import { SearchMap } from "components/search/SearchMap/SearchMap";
import { formatPhoneNumber, renderAddressMetadata } from "utils";
import { removeAsterisksAndHashes } from "utils/strings";
import ResultsPagination from "components/search/Pagination/ResultsPagination";
// import { Texting } from "components/Texting";
// import { TextListing } from "components/Texting/Texting";
import { SearchHit, transformHits } from "../../../models/SearchHits";
import styles from "./SearchResults.module.scss";
import ClearSearchButton from "../Refinements/ClearSearchButton";

// NOTE: We will re-implement the texting feature so leaving these comments in the project until then

const SearchResults = ({
  searchResults,
  overlayMapWithSearchResults,
  setAroundLatLng,
  categoryId,
  searchQuery,
}: {
  searchResults: SearchResultsProps;
  overlayMapWithSearchResults: boolean;
  setAroundLatLng: (latLng: { lat: number; lng: number }) => void;
  categoryId?: string;
  searchQuery?: string | null;
}) => {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const sortBy24HourAvailability = Boolean(category?.sortBy24HourAvailability);
  const hits = transformHits(
    searchResults ? (searchResults.hits as unknown as SearchHit[]) : [],
    sortBy24HourAvailability
  );

  const [centerCoords] = useState(null);
  const [googleMapObject, setMapObject] = useState<google.maps.Map | null>(
    null
  );

  useEffect(() => {
    if (centerCoords && googleMapObject) {
      googleMapObject.setCenter(centerCoords);
    }
    document.body.classList.add("searchResultsPage");

    return () => {
      document.body.classList.remove("searchResultsPage");
    };
  }, [googleMapObject, centerCoords]);

  if (!searchResults) return null;

  const currentPage = searchResults.page ?? 0;
  const hitsPerPage = searchResults.hitsPerPage ?? 20;

  return (
    <div className={styles.searchResultsAndMapContainer}>
      <div
        className={`${styles.searchResultsContainer} ${
          overlayMapWithSearchResults ? styles.overlayMapWithSearchResults : ""
        }`}
      >
        {!hits.length ? (
          <div
            className={`${styles.noResultsMessage} ${
              hits && hits.length ? styles.hidden : ""
            }`}
          >
            <div className={styles.noResultsText}>
              No results {searchQuery && `for ${` "${searchQuery}" `}`} found in
              your area.
              <br /> Try a different location, filter, or search term.
            </div>

            {searchQuery && <ClearSearchButton />}
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className={styles.searchResultsHeader}>
                <h2>{`${searchResults.nbHits} search results ${
                  searchQuery && ` for ${searchQuery}`
                }`}</h2>
                <ClearSearchButton />
              </div>
            )}
            {hits.map((hit, index) => (
              <SearchResult
                hit={hit}
                index={currentPage * hitsPerPage + index + 1}
                // categoryId={categoryId} // Keep for category ticket
                key={`${hit.id} - ${hit.name}`}
              />
            ))}
            <ResultsPagination noResults={!hits || !hits.length} />
          </>
        )}
      </div>
      <SearchMap
        hits={hits}
        page={0}
        hitsPerPage={hits.length}
        mapObject={googleMapObject}
        setMapObject={setMapObject}
        setAroundLatLng={setAroundLatLng}
        overlayMapWithSearchResults={overlayMapWithSearchResults}
      />
    </div>
  );
};

const SearchResult = ({
  hit,
  index,
}: {
  hit: SearchHit;
  index: number;
  // categoryId: string | undefined;
}) => {
  // Keep for Phase 2:
  // const [textingIsOpen, setTextingIsOpen] = useState(false);

  // let listing: TextListing;
  // if (hit.type === "service") {
  //   listing = {
  //     listingName: hit.name,
  //     type: hit.type,
  //     serviceId: hit.id,
  //   };
  // } else {
  //   listing = {
  //     listingName: hit.name,
  //     type: hit.type,
  //     resourceId: hit.id,
  //   };
  // }

  // const toggleTextingModal = () => setTextingIsOpen(!textingIsOpen);
  // TODO: this bookmarkAdded boolean should be set in accordance with the value of the bookmark model
  // returned by the API. Fetching the model from the API will need to be done in such a way that it does not
  // block the rendering of the search results and yet does not cause the button to flash in a distracting manner

  // const texting = (
  //   <div
  //     className={styles.sideLink}
  //     data-field="text-me"
  //     role="button"
  //     tabIndex={0}
  //     onClick={toggleTextingModal}
  //   >
  //     <img
  //       src={icon("text-message")}
  //       alt="chat-bubble"
  //       className={styles.sideLinkIcon}
  //     />
  //     <div className={styles.sideLinkText}>Text me the info</div>
  //   </div>
  // );

  const phoneNumber = hit?.phones?.[0]?.number;
  const url = hit.type === "service" ? hit.url : hit.website;
  const basePath = hit.type === "service" ? `services` : `organizations`;

  return (
    <div className={styles.searchResult}>
      {/* Keep for Phase 2: */}
      {/* <Texting
        closeModal={toggleTextingModal}
        listing={listing}
        isShowing={textingIsOpen}
      /> */}
      <div className={styles.searchResultContentContainer}>
        <div>
          <h2 className={styles.title}>
            {index}.{" "}
            <Link
              to={{ pathname: `/${basePath}/${hit.id}` }}
              className={`notranslate ${styles.titleLink}`}
            >
              {hit.name}
            </Link>
          </h2>
          {hit.type === "service" && (
            <div className={styles.serviceOf}>
              <Link
                to={`/organizations/${hit.resource_id}`}
                className={`notranslate ${styles.serviceOfLink}`}
              >
                {hit.service_of}
              </Link>
            </div>
          )}
        </div>
        <div className={styles.searchResultContent}>
          <div className={styles.searchText}>
            <div className={`notranslate ${styles.address}`}>
              {renderAddressMetadata(hit)}
            </div>
            {/* Once we can update all dependencies, we can add remarkBreaks as remarkPlugin here */}
            <ReactMarkdown
              className={`rendered-markdown ${styles.description}`}
              source={
                hit.long_description
                  ? removeAsterisksAndHashes(hit.long_description)
                  : undefined
              }
              linkTarget="_blank"
            />
          </div>
        </div>
      </div>
      <div className={styles.sideLinks}>
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className={`${styles.icon} ${styles["icon-phone"]}`}
          >
            <span className="sr-only">
              Call {formatPhoneNumber(phoneNumber)}
            </span>
          </a>
        )}
        {url && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            className={`${styles.icon} ${styles["icon-popout"]}`}
          >
            <span className="sr-only">Go to website</span>
          </a>
        )}
        {/* Keep for phase 2: */}
        {/* {texting} */}
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
